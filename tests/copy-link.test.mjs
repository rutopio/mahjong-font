import assert from "node:assert/strict";
import { test } from "node:test";
import { useMountEffect } from "@rutopio/ui/use-mount-effect";
import { Window } from "happy-dom";
import * as React from "react";
import * as jsx from "react/jsx-runtime";
import { deferred, loadSource } from "./helpers/load-source.mjs";

const Empty = () => null;
const Box = ({ children }) => React.createElement("div", null, children);
const Button = ({ children, onClick }) =>
  React.createElement("button", { onClick, type: "button" }, children);

test("copy link feedback waits for success, reports failure and renews expiry", async () => {
  const window = new Window({ url: "https://mahjong.chingru.com/?tile=1m" });
  Object.assign(globalThis, {
    window,
    document: window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const { createRoot } = await import("react-dom/client");
  let pending, copiedUrl;
  const timers = new Map();
  let timerId = 0;
  window.setTimeout = (callback) => {
    const id = ++timerId;
    timers.set(id, callback);
    return id;
  };
  window.clearTimeout = (id) => timers.delete(id);
  const share = await loadSource(
    new URL("../src/lib/share-link.ts", import.meta.url),
    {
      globals: {
        window,
        navigator: {
          clipboard: {
            writeText(url) {
              copiedUrl = url;
              pending = deferred();
              return pending.promise;
            },
          },
        },
      },
    }
  );
  const errors = [];
  const { ActionButtons } = await loadSource(
    new URL("../src/components/mahjong/action-buttons.tsx", import.meta.url),
    {
      globals: { window },
      imports: {
        react: React,
        "@rutopio/ui/use-mount-effect": { useMountEffect },
        "react/jsx-runtime": jsx,
        "@phosphor-icons/react": Object.fromEntries(
          [
            "ArrowSquareOutIcon",
            "CheckIcon",
            "DownloadSimpleIcon",
            "FacebookLogoIcon",
            "LinkIcon",
            "ShareNetworkIcon",
            "ThreadsLogoIcon",
            "XLogoIcon",
          ].map((name) => [name, Empty])
        ),
        "@rutopio/ui/button": { Button },
        "@rutopio/ui/dialog": Object.fromEntries(
          [
            "Dialog",
            "DialogContent",
            "DialogDescription",
            "DialogHeader",
            "DialogTitle",
          ].map((name) => [name, Box])
        ),
        "react-i18next": { useTranslation: () => ({ t: (key) => key }) },
        sonner: { toast: { error: (text) => errors.push(text) } },
        "@/components/mahjong/tile-svg": { TileSvg: Empty },
        "@/lib/is-touch-device": { isTouchDevice: () => false },
        "@/lib/share-link": share,
        "@/lib/tiles-export": {
          downloadJpg() {},
          downloadPng() {},
          downloadSvg() {},
        },
        "@/lib/url-state": { encodeToQuery: () => "" },
      },
    }
  );
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    await React.act(() =>
      root.render(
        React.createElement(ActionButtons, {
          text: "1m",
          theme: "colorful",
          tileColor: "#123456",
        })
      )
    );
    const button = [...container.querySelectorAll("button")].find(
      (item) => item.textContent === "share.copyLink"
    );
    await React.act(() => button.click());
    assert.equal(button.textContent, "share.copyLink");
    assert.equal(copiedUrl, window.location.href);
    await React.act(async () => pending.reject(new Error("Denied")));
    assert.equal(button.textContent, "share.copyLink");
    assert.equal(errors.length, 1);
    await React.act(() => button.click());
    await React.act(async () => pending.resolve());
    assert.equal(button.textContent, "share.copied");
    const first = [...timers.keys()][0];
    await React.act(() => button.click());
    await React.act(async () => pending.resolve());
    assert.equal(timers.has(first), false);
    assert.equal(timers.size, 1);
    await React.act(() => root.unmount());
    assert.equal(timers.size, 0);
  } finally {
    await window.happyDOM.abort();
  }
});

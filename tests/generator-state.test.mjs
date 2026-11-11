import assert from "node:assert/strict";
import { test } from "node:test";
import { Window } from "happy-dom";
import * as React from "react";
import { loadSource } from "./helpers/load-source.mjs";

function Probe({ useValue, publish }) {
  publish(useValue());
  return null;
}

test("clearing the generator updates its URL and an explicit empty value round-trips", async () => {
  const window = new Window({
    url: "https://mahjong.chingru.com/?tile=1m&theme=color&color=123456#preview",
  });
  Object.assign(globalThis, {
    window,
    document: window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const { createRoot } = await import("react-dom/client");
  const constants = await loadSource(
    new URL("../src/lib/constants.ts", import.meta.url)
  );
  const notation = await loadSource(
    new URL("../src/lib/mahjong-notation.ts", import.meta.url)
  );
  const urlState = await loadSource(
    new URL("../src/lib/url-state.ts", import.meta.url),
    { imports: { "./constants": constants } }
  );
  const { useMahjongState } = await loadSource(
    new URL("../src/hooks/use-mahjong-state.ts", import.meta.url),
    {
      globals: { window },
      imports: {
        react: React,
        "@/lib/constants": constants,
        "@/lib/mahjong-notation": notation,
        "@/lib/url-state": urlState,
      },
    }
  );
  const root = createRoot(document.createElement("div"));
  let state;
  try {
    await React.act(() =>
      root.render(
        React.createElement(Probe, {
          useValue: useMahjongState,
          publish: (next) => {
            state = next;
          },
        })
      )
    );
    assert.equal(state.input, "1m");
    await React.act(() => state.setInput(""));
    assert.equal(new URLSearchParams(window.location.search).get("tile"), "");
    assert.equal(window.location.hash, "#preview");
    assert.equal(urlState.decodeFromQuery(window.location.search).input, "");
    assert.equal(
      urlState.decodeFromQuery(window.location.search).tileColor,
      "#123456"
    );
    assert.notEqual(urlState.decodeFromQuery("").input, "");
    await React.act(() => state.setInput("2m3m"));
    assert.equal(
      urlState.decodeFromQuery(window.location.search).input,
      "2m3m"
    );
  } finally {
    await React.act(() => root.unmount());
    await window.happyDOM.abort();
  }
});

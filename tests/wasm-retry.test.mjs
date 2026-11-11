import assert from "node:assert/strict";
import { test } from "node:test";
import { deferred, loadSource } from "./helpers/load-source.mjs";

test("OG requests share initialization, retry rejection, and reuse success", async () => {
  const pending = deferred();
  let calls = 0;
  const { onRequestGet } = await loadSource(
    new URL("../functions/og.ts", import.meta.url),
    {
      globals: {
        atob,
        fetch: async () => Response.json({ d: [], f: [], c: [] }),
        caches: {
          open: async () => ({
            match: async () => undefined,
            put: async () => {},
          }),
        },
      },
      imports: {
        "@resvg/resvg-wasm": {
          initWasm: () => (++calls === 1 ? pending.promise : Promise.resolve()),
          Resvg: class {
            render() {
              return { asPng: () => new Uint8Array([1]) };
            }
          },
        },
        "@resvg/resvg-wasm/index_bg.wasm": { default: {} },
        "../src/lib/inter-og-font": {
          INTER_OG_BOLD_TTF_BASE64: "",
          INTER_OG_REGULAR_TTF_BASE64: "",
        },
        "../src/lib/render-og-image": {
          OG_WIDTH: 1200,
          parseBrand: () => "IntD",
          renderOgSvg: () => "<svg/>",
        },
        "../src/data/tiles-data.json": { default: {} },
        "../src/lib/image-input": { isValidImageTile: () => true },
        "../src/lib/url-state": {
          decodeFromQuery: () => ({
            input: "1m",
            theme: "colorful",
            tileColor: "#fff",
          }),
        },
      },
    }
  );
  const run = () =>
    onRequestGet({
      request: new Request("https://example.com/og?emoji=u1f600"),
      waitUntil() {},
    });
  const results = Promise.allSettled([run(), run()]);
  await new Promise(setImmediate);
  assert.equal(calls, 1);
  pending.reject(new Error("WASM failed"));
  assert.ok((await results).every((result) => result.status === "rejected"));
  assert.equal((await run()).status, 200);
  assert.equal((await run()).status, 200);
  assert.equal(calls, 2);
});

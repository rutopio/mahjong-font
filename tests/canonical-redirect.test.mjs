import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { createContext, SourceTextModule, SyntheticModule } from "node:vm";
import { transformWithOxc } from "vite";

const source = await readFile(
  new URL("../functions/_middleware.ts", import.meta.url),
  "utf8"
);
const context = createContext({ URL, Response });
const middleware = new SourceTextModule(
  (await transformWithOxc(source, "_middleware.ts")).code,
  { context }
);
// Redirects must return before reading page metadata or rendering images.
const unusedExports = [
  "SITE_URL",
  "OG_HEIGHT",
  "OG_WIDTH",
  "OG_IMAGE_VERSION",
  "parseBrand",
  "metaFor",
  "OG_LOCALE",
  "pathFor",
  "resolveRoute",
  "isValidImageTile",
  "decodeFromQuery",
  "encodeToQuery",
  "HREFLANG",
  "imageAltFor",
  "localeForPath",
  "stripLocale",
  "pageMeta",
  "pagePath",
];
await middleware.link(
  () =>
    new SyntheticModule(
      unusedExports,
      function () {
        for (const name of unusedExports) this.setExport(name, undefined);
      },
      { context }
    )
);
await middleware.evaluate();

test("canonical redirects preserve paths and queries without allowing another host", async () => {
  for (const path of [
    "/",
    "/en/about?x=1&x=2",
    "/a%20b?url=https%3A%2F%2Fexample.com",
    "//example.com/path?x=1",
    "///a",
  ]) {
    const request = new Request(`https://preview.site.pages.dev${path}`);
    const response = await middleware.namespace.onRequest({ request });
    assert.equal(response.status, 301);
    assert.equal(
      response.headers.get("location"),
      `https://mahjong.chingru.com${path}`
    );
    assert.equal(
      new URL(response.headers.get("location")).hostname,
      "mahjong.chingru.com"
    );
  }
});

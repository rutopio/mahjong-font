import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { extname, join, resolve } from "node:path";

// Run by hand: PLAYWRIGHT_PATH=/path/to/playwright node scripts/font-browser-audit.mjs DIST OUTPUT
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright");
const [distArg, outputArg] = process.argv.slice(2);
if (!distArg || !outputArg)
  throw new Error("Usage: font-browser-audit.mjs DIST OUTPUT");
const dist = resolve(distArg);
const output = resolve(outputArg);
mkdirSync(output, { recursive: true });
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};
const server = createServer((req, res) => {
  const pathname = decodeURIComponent(
    new URL(req.url, "http://localhost").pathname
  );
  const path = join(dist, pathname);
  const file =
    path.startsWith(`${dist}/`) && existsSync(path) && statSync(path).isFile()
      ? path
      : join(dist, "index.html");
  res.setHeader(
    "Content-Type",
    types[extname(file)] ?? "application/octet-stream"
  );
  res.end(readFileSync(file));
});
await new Promise((resolve) =>
  server.listen(Number(process.env.AUDIT_PORT ?? 54378), "127.0.0.1", resolve)
);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const pageRoutes = [
  "/",
  "/en",
  "/zh_tw",
  "/zh_cn",
  "/about",
  "/en/about",
  "/zh_tw/about",
  "/zh_cn/about",
  "/api",
  "/en/api",
  "/zh_tw/api",
  "/zh_cn/api",
];
const routes = process.env.AUDIT_ROUTES?.split(",") ?? [...pageRoutes];
const networkOnly = process.env.AUDIT_NETWORK_ONLY === "1";
const results = [];
for (const route of routes) {
  process.stdout.write(`Loading ${route}\n`);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const NativeDate = Date;
    const fixed = NativeDate.parse("2026-11-07T00:00:00Z");
    class FixedDate extends NativeDate {
      constructor(...args) {
        super(...(args.length ? args : [fixed]));
      }
      static now() {
        return fixed;
      }
    }
    globalThis.Date = FixedDate;
  });
  const fonts = new Map();
  const fontResponses = [];
  page.on("response", (response) => {
    if (!new URL(response.url()).pathname.endsWith(".woff2")) return;
    const name = decodeURIComponent(new URL(response.url()).pathname);
    fontResponses.push(
      response
        .body()
        .catch(() => null)
        .then((body) => {
          fonts.set(name, body?.length ?? 0);
        })
    );
  });
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  if (networkOnly) {
    const info = await page.evaluate(async () => {
      await document.fonts.ready;
      const chars = new Set();
      const styles = {};
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.textContent ?? "";
        const el = node.parentElement;
        if (!text.trim() || !el || getComputedStyle(el).display === "none")
          continue;
        const css = getComputedStyle(el);
        const key = `${css.fontFamily}|${css.fontStyle}|${css.fontWeight}|${css.fontVariationSettings}|${css.fontFeatureSettings}|${css.hyphens}`;
        styles[key] = (styles[key] ?? 0) + text.length;
        for (const char of text) chars.add(char.codePointAt(0));
      }
      return {
        chars: [...chars].sort((a, b) => a - b),
        styles,
        preloads: [
          ...document.querySelectorAll('link[rel="preload"][as="font"]'),
        ].map((el) => decodeURIComponent(new URL(el.href).pathname)),
      };
    });
    await Promise.all(fontResponses);
    results.push({
      route,
      ...info,
      fonts: Object.fromEntries([...fonts].sort()),
    });
    process.stdout.write(`Captured ${route}\n`);
    await context.close();
    continue;
  }
  await page.evaluate(async () => {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 10000)),
    ]);
    await Promise.race([
      Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {}))
      ),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
  });
  if (process.env.AUDIT_SCENARIO === "probe") {
    await page.evaluate(() => {
      const section = document.createElement("section");
      section.id = "font-probe";
      section.style.cssText =
        "position:fixed;inset:0;z-index:99999;background:white;padding:32px;width:100vw;height:100vh;font-family:var(--font-sans);font-size:18px;";
      section.innerHTML = `<p style="font-weight:400">Regular: ō ī Pe̍h-ōe-jī 中文</p>
        <p style="font-weight:550">Semibold: Office fi fl — “quotes” …</p>
        <p style="font-weight:550">Semibold: text with ō ī Σ</p>
        <p style="font-weight:700">Bold: text with ō ī</p>
        <p style="font-style:italic;font-weight:400">Italic: ō ī Σ, <strong style="font-weight:700">bold inside italics</strong></p>
        <p style="font-family:Paper Mono;font-weight:400">Code: 0x1F — { brackets } 1234567890</p>
        <p style="font-family:Paper Mono;font-weight:700">Bold code: É ø Ω 中文 鳳梨</p>
        <p lang="en" style="hyphens:auto;width:110px;overflow-wrap:normal">extraordinarily long hyphenation example</p>
        <p style="font-size:15px;font-weight:550">Component override: 15px semibold text.</p>
        <p style="font-family:var(--font-sans)">Custom Chinese item: 麻將鳳梨</p>
        <p lang="ja" style="font-family:var(--font-sans);font-weight:700">Japanese mixed text: 麻雀と鬱</p>`;
      document.body.append(section);
    });
  }
  if (process.env.AUDIT_SCENARIO) {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
  }
  const info = await page.evaluate(() => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );
    const styles = {};
    const chars = new Set();
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent ?? "";
      if (!text.trim()) continue;
      const el = node.parentElement;
      if (!el || getComputedStyle(el).display === "none") continue;
      const css = getComputedStyle(el);
      const key = `${css.fontFamily}|${css.fontStyle}|${css.fontWeight}|${css.fontVariationSettings}|${css.fontFeatureSettings}|${css.hyphens}`;
      styles[key] = (styles[key] ?? 0) + text.length;
      for (const char of text) chars.add(char.codePointAt(0));
    }
    const sampleWidths = [
      ...document.querySelectorAll("p,h1,h2,h3,#font-probe p"),
    ]
      .slice(0, 200)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(el);
        const textRect = range.getBoundingClientRect();
        return [
          el.textContent?.slice(0, 30),
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          textRect.x,
          textRect.y,
          textRect.width,
          textRect.height,
        ];
      });
    return {
      title: document.title,
      styles,
      chars: [...chars].sort((a, b) => a - b),
      preloads: [
        ...document.querySelectorAll('link[rel="preload"][as="font"]'),
      ].map((el) => decodeURIComponent(new URL(el.href).pathname)),
      // biome-ignore lint/performance/useDomNodeTextContent: audit the visible rendered text, excluding hidden elements.
      bodyText: document.body.innerText,
      sampleWidths,
    };
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const root = await cdp.send("DOM.getDocument");
  const paragraph = await cdp.send("DOM.querySelector", {
    nodeId: root.root.nodeId,
    selector: "p",
  });
  const platformFonts = paragraph.nodeId
    ? (
        await cdp.send("CSS.getPlatformFontsForNode", {
          nodeId: paragraph.nodeId,
        })
      ).fonts
    : [];
  const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
  await page.addStyleTag({
    content: "img,video,canvas{visibility:hidden!important}",
  });
  await page.screenshot({
    path: join(output, `${slug}.png`),
    fullPage: process.env.AUDIT_SCENARIO !== "probe",
    animations: "disabled",
  });
  await Promise.all(fontResponses);
  results.push({
    route,
    ...info,
    platformFonts,
    fonts: Object.fromEntries([...fonts].sort()),
  });
  process.stdout.write(`Captured ${route}\n`);
  await context.close();
}
writeFileSync(join(output, "results.json"), JSON.stringify(results, null, 2));
await browser.close();
await new Promise((resolve) => server.close(resolve));
process.stdout.write(`Audited ${results.length} routes in ${output}\n`);

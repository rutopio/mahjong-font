/**
 * Cloudflare Pages middleware: rewrite the static OG/Twitter image meta tags to
 * point at the on-demand /og image for the current share URL. Crawlers don't
 * run JS, so the per-share preview must be injected into the served HTML here.
 *
 * Only HTML document responses for the app shell are rewritten; the /og
 * function and static assets pass through untouched.
 */

import { OG_HEIGHT, OG_WIDTH } from "../src/lib/render-og-image";
import { decodeFromQuery, encodeToQuery } from "../src/lib/url-state";

class MetaContentRewriter {
  constructor(private readonly content: string) {}
  element(el: Element) {
    el.setAttribute("content", this.content);
  }
}

class MetaHrefRewriter {
  constructor(private readonly href: string) {}
  element(el: Element) {
    el.setAttribute("href", this.href);
  }
}

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);

  // Don't touch the image function or anything that isn't the HTML shell.
  if (url.pathname.startsWith("/og")) return next();

  const response = await next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  // The /api docs page (and its localized variants /en/api, /zh_tw/api,
  // /zh_cn/api) has no tile of its own: point og:url at the page itself and use
  // the default tile diagram as a generic cover, instead of inheriting the home
  // page's share URL. (The /img/<tile> image SVG isn't HTML and never gets here.)
  // Everything else is the home page: the image is the shared tile.
  const isDocsPage = /^(?:\/(?:en|zh_tw|zh_cn))?\/api\/?$/.test(url.pathname);

  const state = decodeFromQuery(isDocsPage ? "" : url.search);
  const query = encodeToQuery(state);
  const imageUrl = `${url.origin}/og?${query}`;
  const pageUrl = isDocsPage
    ? `${url.origin}${url.pathname.replace(/\/$/, "")}`
    : `${url.origin}/?${query}`;

  // Canonical points at the current localized page without the share query, so
  // each locale URL is self-canonical and agrees with the hreflang alternates
  // (otherwise every locale would canonicalize to the ja home and cancel them).
  const canonicalPath = url.pathname.replace(/\/$/, "") || "/";
  const canonicalUrl = `${url.origin}${canonicalPath}`;

  return new HTMLRewriter()
    .on('meta[property="og:image"]', new MetaContentRewriter(imageUrl))
    .on('meta[name="twitter:image"]', new MetaContentRewriter(imageUrl))
    .on(
      'meta[property="og:image:width"]',
      new MetaContentRewriter(String(OG_WIDTH))
    )
    .on(
      'meta[property="og:image:height"]',
      new MetaContentRewriter(String(OG_HEIGHT))
    )
    .on('meta[property="og:url"]', new MetaContentRewriter(pageUrl))
    .on('link[rel="canonical"]', new MetaHrefRewriter(canonicalUrl))
    .transform(response);
};

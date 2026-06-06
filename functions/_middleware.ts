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

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);

  // Don't touch the image function or anything that isn't the HTML shell.
  if (url.pathname.startsWith("/og")) return next();

  const response = await next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  // Normalize the query so the image URL matches what the app would produce
  // (defaults applied for missing/invalid params).
  const state = decodeFromQuery(url.search);
  const query = encodeToQuery(state);
  const imageUrl = `${url.origin}/og?${query}`;
  const pageUrl = `${url.origin}/?${query}`;

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
    .transform(response);
};

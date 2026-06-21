/**
 * Cloudflare Pages middleware: inject per-route SEO metadata into the served
 * HTML. The app is a single index.html shell whose static head only describes
 * the ja home page, and crawlers don't run JS, so the correct title /
 * description / canonical / locale / OG tags and hreflang alternates for each
 * route (and language) must be written here.
 *
 * On top of that, the OG/Twitter image is swapped for the on-demand /og image
 * of the current share URL (the home page shares the rendered tile).
 *
 * Only the HTML app shell is rewritten; /og and static assets pass through.
 */

import { OG_HEIGHT, OG_WIDTH } from "../src/lib/render-og-image";
import { decodeFromQuery, encodeToQuery } from "../src/lib/url-state";
import { metaFor, OG_LOCALE, pathFor, resolveRoute } from "./seo-meta";

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

class TextRewriter {
  constructor(private readonly value: string) {}
  element(el: Element) {
    el.setInnerContent(this.value);
  }
}

const setContent = (v: string) => new MetaContentRewriter(v);

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);

  // Canonical-host redirect. Any *.pages.dev host (<project>.pages.dev and every
  // <hash>.<project>.pages.dev preview URL) is 301'd to the custom domain, path +
  // query preserved, so the pages.dev origin never gets indexed or linked.
  if (url.hostname.endsWith(".pages.dev")) {
    const target = new URL(
      url.pathname + url.search,
      "https://mahjong.chingru.com"
    );
    return Response.redirect(target.toString(), 301);
  }

  // Don't touch the image function or anything that isn't the HTML shell.
  if (url.pathname.startsWith("/og")) return next();

  const response = await next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const route = resolveRoute(url.pathname);
  const { title, description } = metaFor(route);
  const locale = OG_LOCALE[route.lang];

  // The /api docs page has no tile of its own: point og:url at the page itself
  // and use the default tile diagram as a generic cover, instead of inheriting
  // the home page's share URL. Everything else is the home page: the image is
  // the shared tile.
  const isDocsPage = route.page === "api";

  const state = decodeFromQuery(isDocsPage ? "" : url.search);
  const query = encodeToQuery(state);
  const imageUrl = `${url.origin}/og?${query}`;
  const pageUrl = isDocsPage
    ? `${url.origin}${url.pathname.replace(/\/$/, "")}`
    : `${url.origin}/?${query}`;

  // Canonical points at the current localized page without the share query, so
  // each locale URL is self-canonical and agrees with the hreflang alternates
  // (otherwise every locale would canonicalize to the ja home and cancel them).
  const canonicalUrl = `${url.origin}${route.path}`;

  // hreflang alternates: the same page in each language. x-default points to ja.
  const jaAlt = `${url.origin}${pathFor("ja", route.page)}`;
  const enAlt = `${url.origin}${pathFor("en", route.page)}`;
  const zhTwAlt = `${url.origin}${pathFor("zh-TW", route.page)}`;
  const zhCnAlt = `${url.origin}${pathFor("zh-CN", route.page)}`;

  return new HTMLRewriter()
    .on("title", new TextRewriter(title))
    .on('meta[name="description"]', setContent(description))
    .on('link[rel="canonical"]', new MetaHrefRewriter(canonicalUrl))
    .on('link[hreflang="ja"]', new MetaHrefRewriter(jaAlt))
    .on('link[hreflang="en"]', new MetaHrefRewriter(enAlt))
    .on('link[hreflang="zh-Hant"]', new MetaHrefRewriter(zhTwAlt))
    .on('link[hreflang="zh-Hans"]', new MetaHrefRewriter(zhCnAlt))
    .on('link[hreflang="x-default"]', new MetaHrefRewriter(jaAlt))
    .on('meta[property="og:url"]', setContent(pageUrl))
    .on('meta[property="og:locale"]', setContent(locale))
    .on('meta[property="og:title"]', setContent(title))
    .on('meta[property="og:description"]', setContent(description))
    .on('meta[property="og:image"]', setContent(imageUrl))
    .on('meta[property="og:image:width"]', setContent(String(OG_WIDTH)))
    .on('meta[property="og:image:height"]', setContent(String(OG_HEIGHT)))
    .on('meta[name="twitter:title"]', setContent(title))
    .on('meta[name="twitter:description"]', setContent(description))
    .on('meta[name="twitter:image"]', setContent(imageUrl))
    .transform(response);
};

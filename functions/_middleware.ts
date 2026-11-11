// Crawlers need localized metadata and tile previews before the SPA runs.

import { isValidImageTile } from "../src/lib/image-input";
import { OG_HEIGHT, OG_WIDTH } from "../src/lib/render-og-image";
import { decodeFromQuery, encodeToQuery } from "../src/lib/url-state";
import {
  HREFLANG,
  imageAltFor,
  metaFor,
  OG_LOCALE,
  pathFor,
  resolveRoute,
} from "./seo-meta";

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

class LangRewriter {
  constructor(private readonly lang: string) {}
  element(el: Element) {
    el.setAttribute("lang", this.lang);
  }
}

const setContent = (v: string) => new MetaContentRewriter(v);

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);

  // Keep preview hosts out of search indexes.
  if (url.hostname.endsWith(".pages.dev")) {
    return Response.redirect(
      `https://mahjong.chingru.com${url.pathname}${url.search}`,
      301
    );
  }

  if (url.pathname.startsWith("/og")) return next();

  const response = await next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const route = resolveRoute(url.pathname);
  const { title, description } = metaFor(route);
  const locale = OG_LOCALE[route.lang];

  // Only generator links use a tile preview; content pages use the generic cover.
  const isContentPage = route.page !== "home";

  const state = decodeFromQuery(isContentPage ? "" : url.search);
  const query = encodeToQuery(state);
  const imageState = isValidImageTile(state.input)
    ? state
    : decodeFromQuery("");
  const imageUrl = `${url.origin}/og?${encodeToQuery(imageState)}`;
  const imageAlt = imageAltFor(route.lang, imageState.input);
  const pageUrl = `${url.origin}${route.path}${isContentPage || !url.search ? "" : `?${query}`}`;

  // Keep each locale self-canonical so canonical URLs agree with hreflang alternates.
  const canonicalUrl = `${url.origin}${route.path}`;

  const jaAlt = `${url.origin}${pathFor("ja", route.page)}`;
  const enAlt = `${url.origin}${pathFor("en", route.page)}`;
  const zhTwAlt = `${url.origin}${pathFor("zh-TW", route.page)}`;
  const zhCnAlt = `${url.origin}${pathFor("zh-CN", route.page)}`;

  return new HTMLRewriter()
    .on("html", new LangRewriter(HREFLANG[route.lang]))
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
    .on('meta[property="og:image:alt"]', setContent(imageAlt))
    .on('meta[property="og:image:width"]', setContent(String(OG_WIDTH)))
    .on('meta[property="og:image:height"]', setContent(String(OG_HEIGHT)))
    .on('meta[name="twitter:title"]', setContent(title))
    .on('meta[name="twitter:description"]', setContent(description))
    .on('meta[name="twitter:image"]', setContent(imageUrl))
    .on('meta[name="twitter:image:alt"]', setContent(imageAlt))
    .transform(response);
};

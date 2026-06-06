/**
 * Shared encoding/decoding of the app state carried in the URL query string
 * (?tile=...&theme=...&color=...). Used by the client hook and by the
 * server-side OG image function, so both agree on defaults and parsing.
 */

import { DEFAULT_TILE_COLOR } from "./constants";

const THEME_URL_MAP: Record<string, string> = {
  mono: "monochrome",
  color: "colorful",
};
const THEME_INTERNAL_MAP: Record<string, string> = {
  monochrome: "mono",
  colorful: "color",
};

const DEFAULT_INPUT = "7m7m7m2p3p4p8p8p8p4s5s6s8s_8s";
const DEFAULT_THEME = "colorful";

interface MahjongUrlState {
  input: string;
  theme: string;
  tileColor: string;
}

const DEFAULT_STATE: MahjongUrlState = {
  input: DEFAULT_INPUT,
  theme: DEFAULT_THEME,
  tileColor: DEFAULT_TILE_COLOR,
};

/** Serialize state into a query string (without the leading "?"). */
export function encodeToQuery(state: MahjongUrlState): string {
  const urlTheme = THEME_INTERNAL_MAP[state.theme] || "mono";
  const params = new URLSearchParams({ tile: state.input, theme: urlTheme });
  if (urlTheme === "color") {
    params.set("color", state.tileColor.replace("#", ""));
  }
  return params.toString();
}

/**
 * Parse a query string into state. Returns the full default state when any
 * required field is missing or invalid, rather than partially merging — a
 * malformed URL falls back entirely to the default.
 */
export function decodeFromQuery(search: string): MahjongUrlState {
  const params = new URLSearchParams(search);
  const input = params.get("tile");
  const urlTheme = params.get("theme");
  const theme = urlTheme ? THEME_URL_MAP[urlTheme] : undefined;

  if (!input || !theme) return DEFAULT_STATE;

  const urlColor = params.get("color");
  const tileColor =
    theme === "colorful" && urlColor ? `#${urlColor}` : DEFAULT_TILE_COLOR;

  return { input, theme, tileColor };
}

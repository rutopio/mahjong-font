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
const HEX_COLOR = /^[0-9a-f]{6}$/i;

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

export function encodeToQuery(state: MahjongUrlState): string {
  const urlTheme = THEME_INTERNAL_MAP[state.theme] || "color";
  const params = new URLSearchParams({ tile: state.input, theme: urlTheme });
  if (urlTheme === "color") {
    params.set("color", state.tileColor.replace("#", ""));
  }
  return params.toString();
}

/** tileOverride supplies notation from the /img path instead of the query. */
export function decodeFromQuery(
  search: string,
  tileOverride?: string
): MahjongUrlState {
  const params = new URLSearchParams(search);
  const input = tileOverride ?? params.get("tile");
  const urlTheme = params.get("theme");
  const theme = urlTheme ? THEME_URL_MAP[urlTheme] : undefined;

  if (input === null) return DEFAULT_STATE;

  const resolvedTheme = theme || DEFAULT_THEME;
  const urlColor = params.get("color");
  const tileColor =
    resolvedTheme === "colorful" && urlColor && HEX_COLOR.test(urlColor)
      ? `#${urlColor}`
      : DEFAULT_TILE_COLOR;

  return { input, theme: resolvedTheme, tileColor };
}

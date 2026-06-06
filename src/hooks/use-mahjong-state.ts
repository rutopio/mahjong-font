import { useEffect, useState } from "react";

import { DEFAULT_TILE_COLOR, optionValues } from "@/lib/constants";
import { transformString } from "@/lib/transform-string";

const STORAGE_KEY_INPUT = "japanese-mahjong-font:input";
const STORAGE_KEY_THEME = "japanese-mahjong-font:theme";
const STORAGE_KEY_TILE_COLOR = "japanese-mahjong-font:tile-color";

const THEME_URL_MAP: Record<string, string> = {
  mono: "monochrome",
  color: "colorful",
};
const THEME_INTERNAL_MAP: Record<string, string> = {
  monochrome: "mono",
  colorful: "color",
};

const DEFAULT_INPUT = "19m19p19s1234567z_1m";
const DEFAULT_THEME = "monochrome";

const encodeToHash = (
  inputValue: string,
  themeValue: string,
  tileColorValue: string
) => {
  const urlTheme = THEME_INTERNAL_MAP[themeValue] || "mono";
  const params = new URLSearchParams({ input: inputValue, theme: urlTheme });
  if (urlTheme === "color") {
    params.set("tile", tileColorValue.replace("#", ""));
  }
  return params.toString();
};

const decodeFromHash = (hash: string) => {
  const params = new URLSearchParams(hash);
  const inputValue = params.get("input");
  const urlTheme = params.get("ui.theme");
  const urlTileColor = params.get("tile");
  const themeValue = urlTheme ? (THEME_URL_MAP[urlTheme] ?? null) : null;
  const tileColorValue = urlTileColor ? `#${urlTileColor}` : null;
  const legacyInput =
    !params.has("input") && hash ? hash.replaceAll(".", " ") : null;
  return {
    input: inputValue || legacyInput,
    theme: themeValue,
    tileColor: tileColorValue,
  };
};

const saveToStorage = (
  inputValue: string,
  themeValue: string,
  tileColorValue: string
) => {
  try {
    localStorage.setItem(STORAGE_KEY_INPUT, inputValue);
    localStorage.setItem(STORAGE_KEY_THEME, themeValue);
    localStorage.setItem(STORAGE_KEY_TILE_COLOR, tileColorValue);
  } catch {
    // localStorage not available
  }
};

const loadFromStorage = () => {
  try {
    return {
      input: localStorage.getItem(STORAGE_KEY_INPUT),
      theme: localStorage.getItem(STORAGE_KEY_THEME),
      tileColor: localStorage.getItem(STORAGE_KEY_TILE_COLOR),
    };
  } catch {
    return { input: null, theme: null, tileColor: null };
  }
};

const findMatchingOption = (inputValue: string): string => {
  for (const [key, value] of Object.entries(optionValues)) {
    if (value === inputValue || transformString(value) === inputValue) {
      return key;
    }
  }
  return "";
};

const getInitialState = () => {
  const hash = window.location.hash.slice(1);
  const fromUrl = decodeFromHash(hash);
  const fromStorage = loadFromStorage();
  return {
    input: fromUrl.input ?? fromStorage.input ?? DEFAULT_INPUT,
    theme: fromUrl.theme ?? fromStorage.theme ?? DEFAULT_THEME,
    tileColor: fromUrl.tileColor ?? fromStorage.tileColor ?? DEFAULT_TILE_COLOR,
  };
};

/**
 * Owns the generator's core state (input, theme, tile color) and keeps it in
 * sync with the URL hash and localStorage. Also derives the matching yaku
 * option for the current input.
 */
export function useMahjongState() {
  const [input, setInput] = useState(() => getInitialState().input);
  const [selectedOption, setSelectedOption] = useState(() =>
    findMatchingOption(getInitialState().input)
  );
  const [theme, setTheme] = useState(() => getInitialState().theme);
  const [tileColor, setTileColor] = useState(() => getInitialState().tileColor);

  // Sync URL hash and localStorage on every state change
  useEffect(() => {
    if (!input) return;
    const currentHash = window.location.hash.slice(1);
    const encodedHash = encodeToHash(input, theme, tileColor);
    if (currentHash !== encodedHash) {
      window.location.hash = encodedHash;
    }
    saveToStorage(input, theme, tileColor);
  }, [input, theme, tileColor]);

  const handleOptionChange = (value: string) => {
    const transformedValue = transformString(
      optionValues[value as keyof typeof optionValues]
    );
    setInput(transformedValue);
    setSelectedOption(value);
  };

  return {
    input,
    setInput,
    selectedOption,
    theme,
    setTheme,
    tileColor,
    setTileColor,
    handleOptionChange,
  };
}

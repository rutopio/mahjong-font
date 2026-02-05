"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2Icon } from "lucide-react";

import { ActionButtons } from "@/components/action-buttons";
import { InputSection } from "@/components/input-section";
import { MahjongPreview } from "@/components/mahjong-preview";
import { NotationsModal } from "@/components/notations-modal";
import { DEFAULT_TILE_COLOR, optionValues } from "@/lib/constants";
import { transformString } from "@/lib/transform-string";

// localStorage keys
const STORAGE_KEY_INPUT = "japanese-mahjong-font:input";
const STORAGE_KEY_THEME = "japanese-mahjong-font:theme";
const STORAGE_KEY_TILE_COLOR = "japanese-mahjong-font:tile-color";

// Map between URL theme values and internal theme values
const THEME_URL_MAP: Record<string, string> = {
  mono: "monochrome",
  color: "colorful",
};
const THEME_INTERNAL_MAP: Record<string, string> = {
  monochrome: "mono",
  colorful: "color",
};

// Default values
const DEFAULT_INPUT = "19m19p19s1234567z_1m";
const DEFAULT_THEME = "monochrome";
const PALETTE_STYLE_ID = "mahjong-palette-style";

export default function Home() {
  const { t, ready } = useTranslation();
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const renderedTextRef = useRef<HTMLDivElement>(null);
  const [showNotations, setShowNotations] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [tileColor, setTileColor] = useState(DEFAULT_TILE_COLOR);

  // URL encoding using URLSearchParams for reliability
  const encodeToHash = (
    inputValue: string,
    themeValue: string,
    tileColorValue: string
  ) => {
    const urlTheme = THEME_INTERNAL_MAP[themeValue] || "mono";
    const params = new URLSearchParams({
      input: inputValue,
      theme: urlTheme,
    });

    // Only include tile color when theme is colorful
    if (urlTheme === "color") {
      params.set("tile", tileColorValue.replace("#", ""));
    }

    return params.toString();
  };

  const decodeFromHash = (hash: string) => {
    const params = new URLSearchParams(hash);
    const inputValue = params.get("input");
    const urlTheme = params.get("theme");
    const urlTileColor = params.get("tile");
    const themeValue = urlTheme ? THEME_URL_MAP[urlTheme] || null : null;
    const tileColorValue = urlTileColor ? `#${urlTileColor}` : null;
    // Legacy format fallback (dots as spaces)
    const legacyInput =
      !params.has("input") && hash ? hash.replaceAll(".", " ") : null;
    return {
      input: inputValue || legacyInput,
      theme: themeValue,
      tileColor: tileColorValue,
    };
  };

  // localStorage helpers
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

  // Find matching option key for a given input value
  const findMatchingOption = (inputValue: string): string => {
    for (const [key, value] of Object.entries(optionValues)) {
      if (value === inputValue || transformString(value) === inputValue) {
        return key;
      }
    }
    return "";
  };

  const handleColorChange = (value: string) => {
    setTileColor(value);
  };

  // Dynamically update font-palette-values for COLR font
  useEffect(() => {
    let style = document.getElementById(
      PALETTE_STYLE_ID
    ) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = PALETTE_STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
            @font-palette-values --custom-palette {
                font-family: Riichi-Mahjong-Colorful;
                base-palette: 0;
                override-colors: 3 ${tileColor};
            }
        `;

    return () => {
      style?.remove();
    };
  }, [tileColor]);

  // Initialize: Priority: 1. URL → 2. localStorage → 3. defaults
  useEffect(() => {
    if (!isInitialized) {
      const hash = window.location.hash.slice(1);
      const fromUrl = decodeFromHash(hash);
      const fromStorage = loadFromStorage();

      // Determine final values based on priority
      const finalInput = fromUrl.input ?? fromStorage.input ?? DEFAULT_INPUT;
      const finalTheme = fromUrl.theme ?? fromStorage.theme ?? DEFAULT_THEME;
      const finalTileColor =
        fromUrl.tileColor ?? fromStorage.tileColor ?? DEFAULT_TILE_COLOR;

      setInput(finalInput);
      setTheme(finalTheme);
      setTileColor(finalTileColor);
      setSelectedOption(findMatchingOption(finalInput));

      // Save to localStorage and update URL
      saveToStorage(finalInput, finalTheme, finalTileColor);
      window.location.hash = encodeToHash(
        finalInput,
        finalTheme,
        finalTileColor
      );

      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update URL and localStorage when input, theme, or tileColor changes
  useEffect(() => {
    if (input && isInitialized) {
      const currentHash = window.location.hash.slice(1);
      const encodedHash = encodeToHash(input, theme, tileColor);

      if (currentHash !== encodedHash) {
        window.location.hash = encodedHash;
      }
      saveToStorage(input, theme, tileColor);
    }
  }, [input, theme, tileColor, isInitialized]);

  const handleOptionChange = (value: string) => {
    const transformedValue = transformString(
      optionValues[value as keyof typeof optionValues]
    );
    setInput(transformedValue);
    setSelectedOption(value);
  };

  if (!ready) {
    return (
      <div
        className="flex h-dvh w-full items-center justify-center"
        role="status"
        aria-busy="true"
        aria-label="Loading"
      >
        <Loader2Icon
          className="size-12 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`m-auto flex h-full w-full flex-col items-center justify-center gap-8 p-6 lg:max-w-4xl`}
    >
      <h1 className="text-center text-2xl font-bold text-balance">
        {t("toolTitle")}
      </h1>

      <InputSection
        input={input}
        onInputChange={setInput}
        selectedOption={selectedOption}
        onOptionChange={handleOptionChange}
        theme={theme}
        onThemeChange={setTheme}
        onShowNotations={() => setShowNotations(true)}
        tileColor={tileColor}
        onColorChange={handleColorChange}
      />

      <MahjongPreview
        text={transformString(input)}
        theme={theme}
        ref={renderedTextRef}
      />

      {input && <ActionButtons renderedTextRef={renderedTextRef} />}

      <NotationsModal
        open={showNotations}
        onOpenChange={setShowNotations}
        theme={theme}
      />
    </div>
  );
}

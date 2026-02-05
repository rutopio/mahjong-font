"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import localFont from "next/font/local";
import { Loader2Icon } from "lucide-react";

import { ActionButtons } from "@/components/action-buttons";
import { InputSection } from "@/components/input-section";
import { MahjongPreview } from "@/components/mahjong-preview";
import { NotationsModal } from "@/components/notations-modal";
import { transformString } from "@/lib/transform-string";

import { optionValues } from "./constants";

const monochromeFont = localFont({
  src: "../../public/fonts/Riichi-Mahjong-Mono.otf",
  display: "swap",
  variable: "--font-riichi-mahjong-mono",
});

const colorfulFont = localFont({
  src: "../../public/fonts/Riichi-Mahjong-Color.otf",
  display: "swap",
  variable: "--font-riichi-mahjong-color",
});

export default function Home() {
  const { t, ready } = useTranslation();
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [theme, setTheme] = useState("monochrome");
  const renderedTextRef = useRef<HTMLDivElement>(null);
  const [showNotations, setShowNotations] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // URL encoding using URLSearchParams for reliability
  const encodeToHash = (value: string) => {
    const params = new URLSearchParams({ input: value });
    return params.toString();
  };

  const decodeFromHash = (hash: string) => {
    // New format: input=xxx
    const params = new URLSearchParams(hash);
    if (params.has("input")) {
      return params.get("input") || "";
    }
    // Fallback: legacy format (dots as spaces)
    return hash.replaceAll(".", " ");
  };

  // Initialize: from hash or set default value
  useEffect(() => {
    if (!isInitialized) {
      const hash = window.location.hash.slice(1);

      if (hash) {
        const decodedInput = decodeFromHash(hash);
        setInput(decodedInput);
        setSelectedOption("");
      } else {
        const defaultInput = "19m19p19s1234567z_1m";
        setInput(defaultInput);
        setSelectedOption("kokushi");
        window.location.hash = encodeToHash(defaultInput);
      }

      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (input && isInitialized) {
      const currentHash = window.location.hash.slice(1);
      const encodedInput = encodeToHash(input);

      if (currentHash !== encodedInput) {
        window.location.hash = encodedInput;
      }
    }
  }, [input, isInitialized]);

  const handleOptionChange = (value: string) => {
    const transformedValue = transformString(
      optionValues[value as keyof typeof optionValues],
    );
    setInput(transformedValue);
    setSelectedOption("");
  };

  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2Icon className="size-12 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`p-6 m-auto flex flex-col h-full w-full lg:max-w-4xl items-center justify-center gap-8 ${monochromeFont.variable} ${colorfulFont.variable}`}
    >
      <div className="text-center text-2xl font-bold">{t("toolTitle")}</div>

      <InputSection
        input={input}
        onInputChange={setInput}
        selectedOption={selectedOption}
        onOptionChange={handleOptionChange}
        theme={theme}
        onThemeChange={setTheme}
        onShowNotations={() => setShowNotations(true)}
      />

      <MahjongPreview
        text={transformString(input)}
        theme={theme}
        ref={renderedTextRef}
      />

      {input && (
        <ActionButtons input={input} renderedTextRef={renderedTextRef} />
      )}

      <NotationsModal
        open={showNotations}
        onOpenChange={setShowNotations}
        theme={theme}
      />
    </div>
  );
}

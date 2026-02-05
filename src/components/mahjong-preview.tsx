"use client";

import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

interface MahjongPreviewProps {
  text: string;
  theme: string;
}

export const MahjongPreview = forwardRef<HTMLDivElement, MahjongPreviewProps>(
  function MahjongPreview({ text, theme }, ref) {
    const { t } = useTranslation();

    const isColorful = theme === "colorful";

    return (
      <div
        role="img"
        aria-label={t("mahjongPreview")}
        className={`no-wrap mx-auto mt-8 flex items-center text-center text-3xl leading-loose md:text-6xl ${theme === "monochrome" ? "font-riichi-mahjong-monochrome" : "font-riichi-mahjong-colorful"}`}
        style={isColorful ? { fontPalette: "--custom-palette" } : undefined}
        ref={ref}
      >
        {text}
      </div>
    );
  }
);

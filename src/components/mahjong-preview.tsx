"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface MahjongPreviewProps {
  text: string;
  theme: string;
}

const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 120;
const BASE_FONT_SIZE = 100;

export const MahjongPreview = forwardRef<HTMLDivElement, MahjongPreviewProps>(
  function MahjongPreview({ text, theme }, ref) {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const [fontSize, setFontSize] = useState(BASE_FONT_SIZE);

    const isColorful = theme === "colorful";
    const fontClass =
      theme === "monochrome"
        ? "font-riichi-mahjong-monochrome"
        : "font-riichi-mahjong-colorful";

    const calculateFontSize = useCallback(() => {
      const container = containerRef.current;
      const measure = measureRef.current;
      if (!container || !measure || !text) return;

      // Get container width (with some padding)
      const containerWidth = container.clientWidth * 0.95;

      // Measure text width at base font size
      measure.style.fontSize = `${BASE_FONT_SIZE}px`;
      const textWidth = measure.scrollWidth;

      if (textWidth === 0) return;

      // Calculate the scale factor
      const scale = containerWidth / textWidth;
      const newFontSize = Math.floor(BASE_FONT_SIZE * scale);

      // Clamp between min and max
      setFontSize(
        Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, newFontSize))
      );
    }, [text]);

    useEffect(() => {
      calculateFontSize();

      const container = containerRef.current;
      if (!container) return;

      const resizeObserver = new ResizeObserver(() => {
        calculateFontSize();
      });

      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }, [calculateFontSize]);

    // Fixed height based on max font size with line-height (1.625 for leading-loose)
    const fixedHeight = Math.ceil(MAX_FONT_SIZE * 1.625);

    return (
      <div
        ref={containerRef}
        className="mx-auto mt-8 flex w-full items-center justify-center"
        style={{ height: `${fixedHeight}px` }}
      >
        {/* Hidden element for measuring text width */}
        <span
          ref={measureRef}
          className={`invisible absolute whitespace-nowrap ${fontClass}`}
          style={isColorful ? { fontPalette: "--custom-palette" } : undefined}
          aria-hidden="true"
        >
          {text}
        </span>

        {/* Visible preview */}
        <div
          role="img"
          aria-label={t("mahjongPreview")}
          className={`text-center leading-loose whitespace-nowrap ${fontClass}`}
          style={{
            fontSize: `${fontSize}px`,
            ...(isColorful ? { fontPalette: "--custom-palette" } : {}),
          }}
          ref={ref}
        >
          {text}
        </div>
      </div>
    );
  }
);

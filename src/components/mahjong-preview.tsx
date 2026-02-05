"use client";

import { forwardRef } from "react";

interface MahjongPreviewProps {
  text: string;
  theme: string;
}

export const MahjongPreview = forwardRef<HTMLDivElement, MahjongPreviewProps>(
  function MahjongPreview({ text, theme }, ref) {
    return (
      <div
        className="mx-auto mt-8 flex items-center text-center text-3xl leading-loose md:text-7xl"
        style={{
          fontFamily:
            theme === "monochrome"
              ? "var(--font-riichi-mahjong-mono)"
              : "var(--font-riichi-mahjong-color)",
        }}
        ref={ref}
      >
        {text}
      </div>
    );
  },
);

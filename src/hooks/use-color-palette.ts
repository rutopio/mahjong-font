import { useEffect } from "react";

const PALETTE_STYLE_ID = "mahjong-palette-style";

/**
 * Injects (and cleans up) the `@font-palette-values` rule that drives the
 * COLR colorful font. The override color follows the given tile color.
 */
export function useColorPalette(tileColor: string) {
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
}

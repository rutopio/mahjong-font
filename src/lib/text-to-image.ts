import { domToPng } from "modern-screenshot";

const PADDING = 24;

/**
 * Renders mahjong notation as a PNG image and triggers download.
 * Uses modern-screenshot to capture DOM element with CSS styles (including font-palette).
 * @param filename - The filename for the downloaded image
 * @param renderedText - The DOM element to capture
 */
export async function textToImage(
  filename: string,
  renderedText: HTMLDivElement
) {
  // Get the dynamic font-palette-values style
  const paletteStyle = document.getElementById("mahjong-palette-style");
  const paletteCSS = paletteStyle?.textContent || "";

  // Calculate actual content size and add padding to output dimensions
  const rect = renderedText.getBoundingClientRect();

  const dataUrl = await domToPng(renderedText, {
    scale: 4,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2,
    style: {
      padding: `${PADDING}px`,
      width: "fit-content",
      maxWidth: "none",
      margin: "0",
      whiteSpace: "nowrap",
      flexWrap: "nowrap",
    },
    onCloneNode: (clonedNode) => {
      // Inject font-palette-values into cloned DOM
      if (clonedNode instanceof HTMLElement && paletteCSS) {
        const style = document.createElement("style");
        style.textContent = paletteCSS;
        clonedNode.prepend(style);
      }
    },
  });

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${filename}.png`;
  link.click();
}

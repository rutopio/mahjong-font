import { domToBlob } from "modern-screenshot";

const PADDING = 24;

/**
 * Convert Blob to File object for Web Share API
 */
function blobToFile(blob: Blob, filename: string): File {
  // Explicitly set MIME type to image/png for iOS to recognize as image
  return new File([blob], filename, { type: "image/png" });
}

/**
 * Check if running on a mobile device
 */
function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/**
 * Check if Web Share API supports sharing files
 */
function canShareFiles(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    typeof navigator.share === "function"
  );
}

/**
 * Renders mahjong notation as a PNG image and triggers download.
 * Uses modern-screenshot to capture DOM element with CSS styles (including font-palette).
 * On iOS/mobile, uses Web Share API for better compatibility.
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

  const blob = await domToBlob(renderedText, {
    type: "image/png",
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

  if (!blob) {
    throw new Error("Failed to generate image");
  }

  const file = blobToFile(blob, `${filename}.png`);

  // Use Web Share API on mobile devices (works well on iOS)
  if (
    isMobileDevice() &&
    canShareFiles() &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (err) {
      // User cancelled or share failed, fall through to download
      if (err instanceof Error && err.name === "AbortError") {
        return; // User cancelled, do nothing
      }
    }
  }

  // Fallback: traditional download for desktop browsers
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.png`;
  link.click();
  URL.revokeObjectURL(url);
}

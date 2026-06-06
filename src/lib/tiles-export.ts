/**
 * Exports the mahjong tile SVG as a downloadable SVG or PNG. Rebuilds the SVG
 * from data (same path as the preview) instead of capturing the DOM, so there
 * is no foreignObject/webfont involvement and iOS produces real images.
 */

import { renderTilesSvg } from "./render-tile-svg";
import { loadTilesData } from "./tiles-data";

/** Output scale for PNG raster (multiplies the SVG's intrinsic pixel size). */
const PNG_SCALE = 2;
const PADDING = 48;

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function canShareFiles(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    typeof navigator.share === "function"
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

interface ExportOptions {
  text: string;
  theme: string;
  tileColor: string;
  filename: string;
}

async function buildSvg({
  text,
  theme,
  tileColor,
}: Omit<ExportOptions, "filename">): Promise<string> {
  const data = await loadTilesData();
  return renderTilesSvg({ text, theme, tileColor, data });
}

/** Download the tiles as a vector SVG file. */
export async function downloadSvg(opts: ExportOptions) {
  const svg = await buildSvg(opts);
  if (!svg) throw new Error("Nothing to export");
  const blob = new Blob([svg], { type: "image/svg+xml" });
  triggerDownload(blob, `${opts.filename}.svg`);
}

/**
 * Rasterize the SVG into a PNG via an <img> + canvas. No foreignObject and no
 * webfont, so this is reliable on iOS Safari.
 */
async function svgToPngBlob(svg: string): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load SVG image"));
      img.src = url;
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const canvas = document.createElement("canvas");
    canvas.width = (w + PADDING * 2) * PNG_SCALE;
    canvas.height = (h + PADDING * 2) * PNG_SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.scale(PNG_SCALE, PNG_SCALE);
    ctx.drawImage(img, PADDING, PADDING, w, h);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate PNG"));
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Download (or share on mobile) the tiles as a PNG image. */
export async function downloadPng(opts: ExportOptions) {
  const svg = await buildSvg(opts);
  if (!svg) throw new Error("Nothing to export");
  const blob = await svgToPngBlob(svg);
  const file = new File([blob], `${opts.filename}.png`, { type: "image/png" });

  if (
    isMobileDevice() &&
    canShareFiles() &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    }
  }

  triggerDownload(blob, `${opts.filename}.png`);
}

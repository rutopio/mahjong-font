import { transformString } from "@/lib/transform-string";

/**
 * Renders mahjong notation as a PNG image and triggers download.
 * @param text - The raw mahjong notation string
 * @param filename - The filename for the downloaded image
 * @param renderedText - The DOM element used to extract font styles
 */
export function textToImage(
  text: string,
  filename: string,
  renderedText: HTMLDivElement,
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const realText = transformString(text);

  const imagePadding = 100;
  const scaleProp = 5;

  const fontFamily = window.getComputedStyle(renderedText).fontFamily;
  const fontSize =
    parseFloat(window.getComputedStyle(renderedText).fontSize) * scaleProp;

  context.font = `${fontSize}px ${fontFamily}`;
  canvas.width = context.measureText(realText).width + imagePadding * 2;
  canvas.height =
    parseInt(window.getComputedStyle(renderedText).fontSize) * scaleProp +
    imagePadding * 2;

  context.font = `${fontSize}px ${fontFamily}`;
  context.fillText(
    realText,
    imagePadding,
    parseInt(window.getComputedStyle(renderedText).fontSize) * scaleProp +
      imagePadding * 1.7,
  );

  const imageData = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imageData;
  link.download = filename;
  link.click();
}

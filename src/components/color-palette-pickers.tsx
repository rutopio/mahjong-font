/**
 * @fileoverview Color palette picker components for emoji customization.
 * Provides color picker popovers using react-aria-components that allow users
 * to select colors using a color area, hue slider, hex input, and preset colors.
 */

import { use, useRef } from "react";
import {
  Button as AriaButton,
  Input as AriaInput,
  Label as AriaLabel,
  ColorPickerStateContext,
  Dialog,
  DialogTrigger,
  parseColor,
  Popover,
} from "react-aria-components";
import { CopyIcon, PipetteIcon } from "lucide-react";
import { toast } from "sonner";

import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  SliderTrack,
} from "@/components/color";
import { Button } from "@/components/ui/button";
import { PRESET_COLORS } from "@/lib/constants";

import type { Color } from "react-aria-components";

/**
 * EyeDropper button component that uses the browser's EyeDropper API
 * to pick colors from anywhere on the screen.
 * Returns null if the EyeDropper API is not supported by the browser.
 *
 * @returns EyeDropper button component or null if not supported.
 */
function EyeDropperButton() {
  const state = use(ColorPickerStateContext)!;

  // Check if browser supports EyeDropper API
  // @ts-expect-error - EyeDropper API may not be available
  if (typeof EyeDropper === "undefined") {
    return null;
  }

  return (
    <AriaButton
      aria-label="Eye dropper"
      className="inline-flex size-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-offset-2"
      onPress={() => {
        // @ts-expect-error - EyeDropper API may not be available
        new EyeDropper()
          .open()
          .then((result: { sRGBHex: string }) =>
            state.setColor(parseColor(result.sRGBHex))
          );
      }}
    >
      <PipetteIcon className="size-4" />
    </AriaButton>
  );
}

interface ColorPickerPopoverProps {
  /** The current color value (hex string). */
  color: string;
  /** Callback invoked when the color changes. */
  onColorChange: (color: string) => void;
  /** Optional index for identification. */
  index?: number;
}

/**
 * Popover-based color picker component.
 * Displays a color swatch button that opens a color picker dialog with
 * color area selector, hue slider, hex input field, and preset colors.
 *
 * @param props - Component props.
 * @returns Color picker popover component.
 */
export function ColorPickerPopover({
  color,
  onColorChange,
}: ColorPickerPopoverProps) {
  // Parse the hex color string to a Color object in HSB format
  const colorValue = parseColor(color).toFormat("hsb");
  // Track if user is dragging to prevent popover from closing during drag
  const isDraggingRef = useRef(false);

  /**
   * Handles color change from the color picker.
   *
   * @param newColor - The new color value from the picker.
   */
  const handleColorChange = (newColor: Color) => {
    onColorChange(newColor.toString("hex"));
  };

  return (
    <DialogTrigger>
      <AriaButton
        className="size-8 cursor-pointer rounded-md p-0 outline-none focus:ring focus:ring-offset-2"
        style={{ backgroundColor: color }}
      >
        <ColorSwatch />
      </AriaButton>
      <Popover
        placement="bottom"
        className="w-fit"
        // Prevent popover from closing during color area/slider drag interactions
        shouldCloseOnInteractOutside={() => !isDraggingRef.current}
      >
        <Dialog
          className="relative flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-lg outline-none"
          aria-label="Color picker"
        >
          <ColorPicker value={colorValue} onChange={handleColorChange}>
            {/* Color Area for saturation and brightness */}
            <div
              onPointerDown={() => {
                isDraggingRef.current = true;
              }}
              onPointerUp={() => {
                isDraggingRef.current = false;
              }}
              onPointerCancel={() => {
                isDraggingRef.current = false;
              }}
            >
              <ColorArea
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
                className="h-48 w-full rounded-b-none border-b-0"
              >
                <ColorThumb className="z-50" />
              </ColorArea>
              {/* Hue Slider */}
              <ColorSlider colorSpace="hsb" channel="hue">
                <SliderTrack className="w-full rounded-t-none border-t-0">
                  <ColorThumb className="top-1/2" />
                </SliderTrack>
              </ColorSlider>
            </div>

            {/* Hex Input Field */}
            <ColorField className="flex w-full gap-2">
              <AriaLabel className="sr-only">Hex Color</AriaLabel>
              <AriaInput
                className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                placeholder="Hex"
                onKeyDown={(e) => {
                  // Blur on Enter to commit the color value
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
              />
              <Button
                className="size-9"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(colorValue.toString("hex"));
                  toast.success("Color copied to clipboard.", {
                    description: `${colorValue.toString("hex")}`,
                  });
                }}
              >
                <CopyIcon size={30} />
              </Button>
            </ColorField>

            {/* Color Swatch Picker */}
            <div className="grid grid-cols-6 gap-2">
              <EyeDropperButton />
              {PRESET_COLORS.map((presetColor) => (
                <ColorSwatchPicker key={presetColor}>
                  <ColorSwatchPickerItem color={presetColor}>
                    <ColorSwatch />
                  </ColorSwatchPickerItem>
                </ColorSwatchPicker>
              ))}
            </div>
          </ColorPicker>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

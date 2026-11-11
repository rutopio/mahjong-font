import { CopyIcon, EyedropperIcon } from "@phosphor-icons/react";
import { Button } from "@rutopio/ui/button";
import { use, useRef } from "react";
import type { Color } from "react-aria-components";
import {
  Button as AriaButton,
  Input as AriaInput,
  Label as AriaLabel,
  ColorPickerStateContext,
  Dialog,
  DialogTrigger,
  Popover,
  parseColor,
} from "react-aria-components";
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
} from "@/components/ui/color";
import { useLang } from "@/hooks/use-lang";
import { PRESET_COLORS } from "@/lib/constants";
import { isTouchDevice } from "@/lib/is-touch-device";

const LABELS = {
  ja: {
    picker: "牌の色を選択",
    area: "彩度と明るさ",
    hue: "色相",
    eyedropper: "スポイト",
    hex: "16 進カラーコード",
    copy: "カラーコードをコピー",
    copied: "カラーコードをコピーしました",
  },
  en: {
    picker: "Pick tile color",
    area: "Saturation and brightness",
    hue: "Hue",
    eyedropper: "Eye dropper",
    hex: "Hex color",
    copy: "Copy hex color",
    copied: "Color copied to clipboard",
  },
  "zh-TW": {
    picker: "選擇牌面顏色",
    area: "飽和度與亮度",
    hue: "色相",
    eyedropper: "滴管",
    hex: "十六進位色碼",
    copy: "複製色碼",
    copied: "色碼已複製",
  },
  "zh-CN": {
    picker: "选择牌面颜色",
    area: "饱和度与亮度",
    hue: "色相",
    eyedropper: "吸管",
    hex: "十六进制色码",
    copy: "复制色码",
    copied: "色码已复制",
  },
} as const;

function EyeDropperButton() {
  const state = use(ColorPickerStateContext);
  const labels = LABELS[useLang()];

  // @ts-expect-error - EyeDropper API may not be available
  if (!state || typeof EyeDropper === "undefined") {
    return null;
  }

  return (
    <AriaButton
      aria-label={labels.eyedropper}
      className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-8 items-center justify-center rounded-md border text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      onPress={() => {
        // @ts-expect-error - EyeDropper API may not be available
        new EyeDropper()
          .open()
          .then((result: { sRGBHex: string }) =>
            state.setColor(parseColor(result.sRGBHex))
          );
      }}
    >
      <EyedropperIcon aria-hidden="true" />
    </AriaButton>
  );
}

interface ColorPickerPopoverProps {
  /** Hex color. */
  color: string;
  onColorChange: (color: string) => void;
}

export function ColorPickerPopover({
  color,
  onColorChange,
}: ColorPickerPopoverProps) {
  const labels = LABELS[useLang()];
  const colorValue = parseColor(color).toFormat("hsb");
  const isDraggingRef = useRef(false);

  // Prefer the OS picker on touch devices to avoid popover drag and dismissal conflicts.
  if (isTouchDevice()) {
    return (
      <label
        className="relative inline-flex size-8 overflow-hidden rounded-md outline-none focus-within:ring focus-within:ring-offset-2"
        style={{ backgroundColor: color }}
      >
        <input
          type="color"
          aria-label={labels.picker}
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="absolute inset-0 size-full opacity-0"
        />
      </label>
    );
  }

  const handleColorChange = (newColor: Color) => {
    onColorChange(newColor.toString("hex"));
  };

  return (
    <DialogTrigger>
      <AriaButton
        aria-label={labels.picker}
        className="size-8 rounded-md p-0 outline-none focus:ring focus:ring-offset-2"
        style={{ backgroundColor: color }}
      >
        <ColorSwatch />
      </AriaButton>
      <Popover
        placement="bottom"
        // A color drag may end outside the popover; keep it open.
        shouldCloseOnInteractOutside={() => !isDraggingRef.current}
      >
        <Dialog
          className="relative flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-lg outline-none"
          aria-label={labels.picker}
        >
          <ColorPicker value={colorValue} onChange={handleColorChange}>
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
                aria-label={labels.area}
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
                className="h-48 w-full rounded-b-none border-b-0"
              >
                <ColorThumb className="z-50" />
              </ColorArea>
              <ColorSlider
                aria-label={labels.hue}
                colorSpace="hsb"
                channel="hue"
              >
                <SliderTrack className="w-full rounded-t-none border-t-0">
                  <ColorThumb className="top-1/2" />
                </SliderTrack>
              </ColorSlider>
            </div>

            <ColorField className="flex w-full gap-2">
              <AriaLabel className="sr-only">{labels.hex}</AriaLabel>
              <AriaInput
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-2.5 py-1 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                placeholder="Hex"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
              />
              <Button
                className="size-9"
                variant="ghost"
                aria-label={labels.copy}
                onClick={() => {
                  navigator.clipboard.writeText(colorValue.toString("hex"));
                  toast.success(labels.copied, {
                    description: `${colorValue.toString("hex")}`,
                  });
                }}
              >
                <CopyIcon aria-hidden="true" />
              </Button>
            </ColorField>

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

import type {
  ColorAreaProps as AriaColorAreaProps,
  ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
  ColorSwatchPickerProps as AriaColorSwatchPickerProps,
  ColorSwatchProps as AriaColorSwatchProps,
  ColorThumbProps as AriaColorThumbProps,
  SliderTrackProps as AriaSliderTrackProps,
} from "react-aria-components";
import {
  ColorArea as AriaColorArea,
  ColorField as AriaColorField,
  ColorPicker as AriaColorPicker,
  ColorSlider as AriaColorSlider,
  ColorSwatch as AriaColorSwatch,
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  ColorThumb as AriaColorThumb,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

// https://www.jollyui.dev/docs/components/color

const ColorSlider = AriaColorSlider;

const ColorField = AriaColorField;

const ColorPicker = AriaColorPicker;

function ColorArea({ className, ...props }: AriaColorAreaProps) {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (className) =>
        cn(
          "border-border size-[192px] shrink-0 rounded-md border shadow-md",
          className
        )
      )}
      {...props}
    />
  );
}

function SliderTrack({ className, ...props }: AriaSliderTrackProps) {
  return (
    <AriaSliderTrack
      className={composeRenderProps(className, (className) =>
        cn("border-border h-7 w-[192px] rounded-md border", className)
      )}
      {...props}
    />
  );
}

function ColorThumb({ className, ...props }: AriaColorThumbProps) {
  return (
    <AriaColorThumb
      className={composeRenderProps(className, (className) =>
        cn(
          "z-10 box-border size-5 rounded-[50%] border-2 border-white shadow-md",
          "data-focus-visible:size-6",
          className
        )
      )}
      {...props}
    />
  );
}

function ColorSwatchPicker({
  className,
  ...props
}: AriaColorSwatchPickerProps) {
  return (
    <AriaColorSwatchPicker
      className={composeRenderProps(className, (className) =>
        cn("flex flex-wrap gap-2", className)
      )}
      {...props}
    />
  );
}

function ColorSwatchPickerItem({
  className,
  ...props
}: AriaColorSwatchPickerItemProps) {
  return (
    <AriaColorSwatchPickerItem
      className={composeRenderProps(className, (className) =>
        cn(
          "ring-offset-background size-8 overflow-hidden rounded-md transition-colors",
          "data-selected:border-white",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          "data-focus-visible:ring-ring data-focus-visible:ring-2 data-focus-visible:outline-none",
          className
        )
      )}
      {...props}
    />
  );
}

function ColorSwatch({ className, ...props }: AriaColorSwatchProps) {
  return (
    <AriaColorSwatch
      className={composeRenderProps(className, (className) =>
        cn("size-8", className)
      )}
      {...props}
    />
  );
}

export {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  SliderTrack,
};

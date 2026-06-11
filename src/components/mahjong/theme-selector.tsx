import { useId } from "react";
import { useTranslation } from "react-i18next";

import { ColorPickerPopover } from "@/components/mahjong/color-picker-popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { themeOptions } from "@/lib/constants";

interface ThemeSelectorProps {
  theme: string;
  onThemeChange: (value: string) => void;
  tileColor: string;
  onColorChange: (value: string) => void;
}

export function ThemeSelector({
  theme,
  onThemeChange,
  tileColor,
  onColorChange,
}: ThemeSelectorProps) {
  const { t } = useTranslation();
  const id = useId();
  const isColorful = theme === "colorful";

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex h-9 rounded-lg bg-muted p-[3px]">
        <RadioGroup
          aria-label={t("ui.theme")}
          className="group relative inline-grid grid-cols-2 items-center gap-0 font-medium text-sm after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-background after:shadow-sm after:transition-[translate] after:duration-200 after:ease-out has-focus-visible:after:ring-[3px] has-focus-visible:after:ring-ring/50 data-[state=colorful]:after:translate-x-full motion-reduce:after:transition-none"
          data-state={theme}
          onValueChange={(value) => onThemeChange(value as string)}
          value={theme}
        >
          {themeOptions.map((option) => (
            <label
              key={option.value}
              htmlFor={`${id}-${option.value}`}
              className="relative z-10 inline-flex h-full cursor-pointer select-none items-center justify-center whitespace-nowrap px-3 text-foreground/60 transition-colors data-active:text-foreground"
              data-active={theme === option.value ? "" : undefined}
            >
              {t(option.labelKey)}
              <RadioGroupItem
                className="sr-only"
                id={`${id}-${option.value}`}
                value={option.value}
              />
            </label>
          ))}
        </RadioGroup>
      </div>
      {isColorful && (
        <ColorPickerPopover color={tileColor} onColorChange={onColorChange} />
      )}
    </div>
  );
}

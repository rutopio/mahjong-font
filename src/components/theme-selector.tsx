import { useTranslation } from "react-i18next";

import { ColorPickerPopover } from "@/components/color-palette-pickers";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const isColorful = theme === "colorful";

  return (
    <div className="flex items-center gap-2">
      <Tabs value={theme} onValueChange={onThemeChange}>
        <TabsList aria-label={t("ui.theme")}>
          {themeOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {t(option.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {isColorful && (
        <ColorPickerPopover color={tileColor} onColorChange={onColorChange} />
      )}
    </div>
  );
}

import { useTranslation } from "react-i18next";

import { NotationsButton } from "@/components/notations-button";
import { ThemeSelector } from "@/components/theme-selector";
import { Input } from "@/components/ui/input";
import { YakuSelector } from "@/components/yaku-selector";

interface InputSectionProps {
  input: string;
  onInputChange: (value: string) => void;
  selectedOption: string;
  onOptionChange: (value: string) => void;
  theme: string;
  onThemeChange: (value: string) => void;
  onShowNotations: () => void;
  tileColor: string;
  onColorChange: (value: string) => void;
}

export function InputSection({
  input,
  onInputChange,
  selectedOption,
  onOptionChange,
  theme,
  onThemeChange,
  onShowNotations,
  tileColor,
  onColorChange,
}: InputSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Input
        type="text"
        placeholder={t("ui.placeholder")}
        aria-label={t("ui.placeholder")}
        className="h-12 w-full bg-white text-center text-sm lg:text-lg"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
      />

      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <YakuSelector
            selectedOption={selectedOption}
            onOptionChange={onOptionChange}
          />
          <ThemeSelector
            theme={theme}
            onThemeChange={onThemeChange}
            tileColor={tileColor}
            onColorChange={onColorChange}
          />
        </div>

        <div className="mx-auto flex items-center gap-2 md:mx-0">
          <NotationsButton onClick={onShowNotations} />
        </div>
      </div>
    </div>
  );
}

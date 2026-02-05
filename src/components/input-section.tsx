"use client";

import { useTranslation } from "react-i18next";
import { InfoIcon, LibraryBigIcon, PaletteIcon } from "lucide-react";

import { ColorPickerPopover } from "@/components/color-palette-pickers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { themeOptions, yakuGroups } from "@/lib/constants";

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
  const isMobile = useIsMobile();
  const isColorful = theme === "colorful";

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Input
        type="text"
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        className="h-12 w-full bg-white text-center text-lg"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
      />

      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <LibraryBigIcon className="size-6" aria-hidden="true" />
            <Select value={selectedOption} onValueChange={onOptionChange}>
              <SelectTrigger className="h-12 w-fit min-w-[180px] bg-white sm:min-w-[180px]">
                <SelectValue placeholder={t("examples")} />
              </SelectTrigger>
              <SelectContent side="top" align={isMobile ? "center" : "start"}>
                {yakuGroups.map((group, index) => (
                  <div key={group.labelKey}>
                    {index > 0 && <SelectSeparator />}
                    <SelectGroup>
                      <SelectLabel>{t(group.labelKey)}</SelectLabel>
                      {group.items.map((item) => (
                        <SelectItem key={item} value={item}>
                          {t(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <PaletteIcon className="size-6" aria-hidden="true" />
            <Select value={theme} onValueChange={onThemeChange}>
              <SelectTrigger className="h-12 w-fit min-w-[180px] bg-white sm:min-w-[100px]">
                <SelectValue placeholder={t("theme")} />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isColorful && (
              <ColorPickerPopover
                color={tileColor}
                onColorChange={onColorChange}
              />
            )}
          </div>
        </div>
        <div className="mx-auto flex items-center gap-2 md:mx-0">
          <Button onClick={onShowNotations}>
            <InfoIcon />
            {t("howToUse")}
          </Button>
        </div>
      </div>
    </div>
  );
}

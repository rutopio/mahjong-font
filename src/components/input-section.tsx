"use client";

import { useTranslation } from "react-i18next";
import { DicesIcon, InfoIcon, PaletteIcon } from "lucide-react";

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
import { yakuGroups, themeOptions } from "@/app/constants";

interface InputSectionProps {
  input: string;
  onInputChange: (value: string) => void;
  selectedOption: string;
  onOptionChange: (value: string) => void;
  theme: string;
  onThemeChange: (value: string) => void;
  onShowNotations: () => void;
}

export function InputSection({
  input,
  onInputChange,
  selectedOption,
  onOptionChange,
  theme,
  onThemeChange,
  onShowNotations,
}: InputSectionProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Input
        type="text"
        placeholder={t("placeholder")}
        className="h-12 w-full bg-white text-center text-lg"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
      />

      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <DicesIcon className="size-6" />
            <Select
              value={selectedOption || undefined}
              onValueChange={onOptionChange}
            >
              <SelectTrigger className="h-12 w-fit min-w-[180px] sm:min-w-[180px] bg-white">
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
            <PaletteIcon className="size-6" />
            <Select value={theme} onValueChange={onThemeChange}>
              <SelectTrigger className="h-12 w-fit min-w-[180px] sm:min-w-[100px] bg-white">
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

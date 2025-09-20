"use client";

import { useTranslation } from "react-i18next";
import { FileDownIcon, FileType2Icon, LanguagesIcon } from "lucide-react";
import { useState } from "react";

import { GithubIcon } from "@/components/icon/github";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const downloadFont = (filePath: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath;
    link.click();
  };

  return (
    <div className="h-12 w-full bg-background p-8">
      <div className="flex h-full w-full items-center justify-end gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              className="rounded-full sm:rounded-md"
            >
              <LanguagesIcon />
              <span className="hidden md:block">{t("language")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={language}
              onValueChange={setLanguage}
            >
              <DropdownMenuRadioItem
                value="ja"
                onClick={() => i18n.changeLanguage("ja")}
              >
                日本語
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="en"
                onClick={() => i18n.changeLanguage("en")}
              >
                English
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="zh-TW"
                onClick={() => i18n.changeLanguage("zh-TW")}
              >
                繁體中文
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="zh-CN"
                onClick={() => i18n.changeLanguage("zh-CN")}
              >
                简体中文
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              className="rounded-full sm:rounded-md"
            >
              <FileType2Icon />
              <span className="hidden md:block">{t("downloadFont")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                downloadFont(
                  "https://raw.githubusercontent.com/rutopio/Japanese-Mahjong-Font-with-OpenType/main/public/fonts/Riichi-Mahjong-Mono.otf"
                )
              }
            >
              <FileDownIcon />
              {t("monochromeFont")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                downloadFont(
                  "https://raw.githubusercontent.com/rutopio/Japanese-Mahjong-Font-with-OpenType/main/public/fonts/Riichi-Mahjong-Color.otf"
                )
              }
            >
              <FileDownIcon />
              {t("colorfulFont")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <a
          href="https://github.com/rutopio/Japanese-Mahjong-Font-with-OpenType"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            type="button"
            className="rounded-full sm:rounded-md"
          >
            <GithubIcon />
            <span className="hidden md:block">Github</span>
          </Button>
        </a>
      </div>
    </div>
  );
}

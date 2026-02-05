"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileDownIcon, FileType2Icon, LanguagesIcon } from "lucide-react";

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
import { languages, fontDownloads, GITHUB_REPO_URL } from "@/app/constants";

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
              aria-label={t("language")}
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
              {languages.map((lang) => (
                <DropdownMenuRadioItem
                  key={lang.value}
                  value={lang.value}
                  onClick={() => i18n.changeLanguage(lang.value)}
                >
                  {lang.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              className="rounded-full sm:rounded-md"
              aria-label={t("downloadFont")}
            >
              <FileType2Icon />
              <span className="hidden md:block">{t("downloadFont")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {fontDownloads.map((font) => (
              <DropdownMenuItem
                key={font.labelKey}
                onClick={() => downloadFont(font.url)}
              >
                <FileDownIcon />
                {t(font.labelKey)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <Button
            variant="ghost"
            type="button"
            className="rounded-full sm:rounded-md"
            aria-label="GitHub"
          >
            <GithubIcon />
            <span className="hidden md:block">GitHub</span>
          </Button>
        </a>
      </div>
    </div>
  );
}

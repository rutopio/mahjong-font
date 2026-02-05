"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileDownIcon, FileType2Icon, LanguagesIcon } from "lucide-react";

import { GithubIcon } from "@/components/icon/github";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { fontDownloads, GITHUB_REPO_URL, languages } from "@/lib/constants";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const isMobile = useIsMobile();

  const downloadFont = (filePath: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath;
    link.click();
  };

  return (
    <nav
      className="container h-fit w-full bg-background p-4"
      aria-label="Main navigation"
    >
      <div className="flex h-full w-full items-center justify-end gap-0 sm:gap-4">
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
            <DropdownMenuGroup>
              {isMobile && (
                <>
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                    {t("language")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
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
            </DropdownMenuGroup>
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
            <DropdownMenuGroup>
              {isMobile && (
                <>
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                    {t("downloadFont")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              {fontDownloads.map((font) => (
                <DropdownMenuItem
                  key={font.labelKey}
                  onClick={() => downloadFont(font.url)}
                >
                  <FileDownIcon />
                  {t(font.labelKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
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
          >
            <GithubIcon />
            <div className="flex items-center gap-0">
              <span>rutopio</span>
              <span className="hidden md:block">{" / "}</span>
              <span className="hidden md:block">
                Japanese-Mahjong-Font-with-OpenType
              </span>
            </div>
          </Button>
        </a>
      </div>
    </nav>
  );
}

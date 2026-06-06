import {
  CheckIcon,
  FileArrowDownIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { GithubIcon } from "@/components/icon/github";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { fontDownloads, GITHUB_REPO_URL, languages } from "@/lib/constants";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const isMobile = useIsMobile();
  const [langDrawerOpen, setLangDrawerOpen] = useState(false);
  const [fontDrawerOpen, setFontDrawerOpen] = useState(false);

  const downloadFont = (filePath: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath;
    link.click();
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
  };

  return (
    <nav
      className="container h-fit w-full bg-background p-4"
      aria-label="Main navigation"
    >
      <div className="flex h-full w-full items-center justify-between gap-0 sm:gap-4">
        <Link to="/" aria-label="Home" className="shrink-0">
          <img
            src="/icon.svg"
            alt=""
            className="h-8 w-8 transition-transform hover:scale-110"
          />
        </Link>
        <div className="flex items-center gap-0 sm:gap-4">
          {isMobile ? (
            <>
              <Button
                variant="ghost"
                type="button"
                className="rounded-full sm:rounded-md"
                aria-label={t("ui.language")}
                onClick={() => setLangDrawerOpen(true)}
              >
                <TranslateIcon aria-hidden="true" />
              </Button>
              <Drawer open={langDrawerOpen} onOpenChange={setLangDrawerOpen}>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>{t("ui.language")}</DrawerTitle>
                    <DrawerDescription className="sr-only">
                      {t("ui.language")}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 pb-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.value}
                        type="button"
                        className="flex w-full items-center justify-between rounded-md px-3 py-3 text-sm hover:bg-accent"
                        onClick={() => {
                          handleLanguageChange(lang.value);
                          setLangDrawerOpen(false);
                        }}
                      >
                        {lang.label}
                        {language === lang.value && (
                          <CheckIcon aria-hidden="true" />
                        )}
                      </button>
                    ))}
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">{t("ui.close")}</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="rounded-full sm:rounded-md"
                  aria-label={t("ui.language")}
                >
                  <TranslateIcon aria-hidden="true" />
                  <span className="hidden md:block">{t("ui.language")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuRadioGroup
                    value={language}
                    onValueChange={handleLanguageChange}
                  >
                    {languages.map((lang) => (
                      <DropdownMenuRadioItem
                        key={lang.value}
                        value={lang.value}
                      >
                        {lang.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isMobile ? (
            <>
              <Button
                variant="ghost"
                type="button"
                className="rounded-full sm:rounded-md"
                aria-label={t("ui.downloadFont")}
                onClick={() => setFontDrawerOpen(true)}
              >
                <FileArrowDownIcon aria-hidden="true" />
              </Button>
              <Drawer open={fontDrawerOpen} onOpenChange={setFontDrawerOpen}>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>{t("ui.downloadFont")}</DrawerTitle>
                    <DrawerDescription className="sr-only">
                      {t("ui.downloadFont")}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 pb-2">
                    {fontDownloads.map((font) => (
                      <button
                        key={font.labelKey}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-accent"
                        onClick={() => {
                          downloadFont(font.url);
                          setFontDrawerOpen(false);
                        }}
                      >
                        {/* <FileArrowDownIcon aria-hidden="true" /> */}
                        {t(font.labelKey)}
                      </button>
                    ))}
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">{t("ui.close")}</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="rounded-full sm:rounded-md"
                  aria-label={t("ui.downloadFont")}
                >
                  <FileArrowDownIcon aria-hidden="true" />
                  <span className="hidden md:block">
                    {t("ui.downloadFont")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {fontDownloads.map((font) => (
                    <DropdownMenuItem
                      key={font.labelKey}
                      onClick={() => downloadFont(font.url)}
                    >
                      {/* <FileArrowDownIcon aria-hidden="true" /> */}
                      {t(font.labelKey)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            asChild
            className="rounded-full sm:rounded-md"
          >
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository, opens in new tab"
            >
              <GithubIcon />
              <span className="flex items-center gap-0">
                <span>rutopio</span>
                <span className="hidden md:block">{" / "}</span>
                <span className="hidden md:block">
                  Japanese-Mahjong-Font-with-OpenType
                </span>
              </span>
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}

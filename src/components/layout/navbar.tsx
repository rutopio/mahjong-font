import {
  CheckIcon,
  FileArrowDownIcon,
  GithubLogoIcon,
  ListIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FluidHoverControls } from "@/components/fluid-hover-controls";
import { HeaderActionDropdown } from "@/components/header-action-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useLang } from "@/hooks/use-lang";
import { useIsMobile } from "@/hooks/use-mobile";
import { fontDownloads, GITHUB_REPO_URL, languages } from "@/lib/constants";
import { type Locale, stripLocale, withLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const navLinkClass =
  "flex h-9 items-center whitespace-nowrap rounded-lg px-3 font-medium text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-muted";
const drawerLinkClass =
  "flex min-h-10 items-center justify-between rounded-lg px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-muted";
const actionClass =
  "cursor-default rounded-lg transition-[background-color,border-color,color,opacity,box-shadow,scale] duration-150 ease-in-out active:scale-[0.96] active:translate-y-0! max-[359px]:size-8";
const FONT_VERSION = "v2.1";
const GITHUB_LABEL: Record<Locale, string> = {
  ja: "GitHub リポジトリ（新しいタブで開く）",
  en: "GitHub repository (opens in a new tab)",
  "zh-TW": "GitHub 原始碼（在新分頁開啟）",
  "zh-CN": "GitHub 源代码（在新标签页打开）",
};

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pathname = useLocation({ select: (l) => l.pathname });
  const language = useLang();
  const currentPage = stripLocale(pathname).replace(/\/$/, "") || "/";
  const isHome = currentPage === "/";
  const isApi = currentPage === "/api";
  const isAbout = currentPage === "/about";
  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const downloadFont = async (fileUrl: string) => {
    const filename = fileUrl.split("/").pop() || "mahjong-font.otf";
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleLanguageChange = (value: string) => {
    navigate({ to: withLocale(pathname, value as Locale) });
  };

  return (
    <header className="w-full bg-background font-heading">
      <nav
        aria-label={
          language === "ja"
            ? "メインナビゲーション"
            : language === "en"
              ? "Main navigation"
              : language === "zh-TW"
                ? "主要導覽"
                : "主要导航"
        }
        className="relative flex w-full items-center justify-between pt-6 sm:pt-12"
      >
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <Link
            to={withLocale("/", language)}
            activeOptions={{ exact: true, includeSearch: false }}
            aria-label={t("ui.navHome")}
            className="flex h-12 shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="flex size-12 items-center justify-center">
              <svg
                aria-hidden="true"
                className="size-8 text-foreground"
                fill="currentColor"
                viewBox="0 0 735 734"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M368,734c203,0,367-164,367-367s-164-367-367-367c-204,0-368,164-368,367s164,367,368,367ZM368,669c-167,0-298-139-298-302c0-165,133-302,298-302c162,0,297,135,297,302c0,162-131,302-297,302ZM368,530c91,0,165-71,165-160c0-91-73-162-165-162c-91,0-165,71-165,162c0,89,74,160,165,160ZM368,468c-55,0-97-44-97-99s42-99,97-99c53,0,97,44,97,99s-44,99-97,99Z" />
              </svg>
            </span>
          </Link>
          {isMobile ? (
            <Drawer open={navOpen} onOpenChange={setNavOpen}>
              <DrawerTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className={actionClass}
                    aria-label={t("ui.navMenu")}
                  >
                    <ListIcon aria-hidden="true" />
                  </Button>
                }
              />
              <DrawerContent>
                <DrawerHeader className="border-border border-b pb-4">
                  <DrawerTitle>Mahjong Font</DrawerTitle>
                </DrawerHeader>
                <nav
                  aria-label={t("ui.navMenu")}
                  className="flex flex-col gap-1 px-4 pt-4 pb-6"
                >
                  <Link
                    to={withLocale("/", language)}
                    activeOptions={{ exact: true }}
                    aria-current={isHome ? "page" : undefined}
                    onClick={() => setNavOpen(false)}
                    className={drawerLinkClass}
                  >
                    {t("ui.navHome")}
                    {isHome && <CheckIcon aria-hidden="true" />}
                  </Link>
                  <Link
                    to={withLocale("/api", language)}
                    activeOptions={{ exact: true }}
                    aria-current={isApi ? "page" : undefined}
                    onClick={() => setNavOpen(false)}
                    className={drawerLinkClass}
                  >
                    {t("ui.navImageApi")}
                    {isApi && <CheckIcon aria-hidden="true" />}
                  </Link>
                  <Link
                    to={withLocale("/about", language)}
                    activeOptions={{ exact: true }}
                    aria-current={isAbout ? "page" : undefined}
                    onClick={() => setNavOpen(false)}
                    className={drawerLinkClass}
                  >
                    {t("ui.navAbout")}
                    {isAbout && <CheckIcon aria-hidden="true" />}
                  </Link>
                </nav>
              </DrawerContent>
            </Drawer>
          ) : (
            <FluidHoverControls label={t("ui.navMenu")}>
              <Link
                to={withLocale("/", language)}
                activeOptions={{ exact: true, includeSearch: false }}
                aria-current={isHome ? "page" : undefined}
                className={navLinkClass}
              >
                {t("ui.navHome")}
              </Link>
              <Link
                to={withLocale("/api", language)}
                activeOptions={{ exact: true }}
                aria-current={isApi ? "page" : undefined}
                className={navLinkClass}
              >
                {t("ui.navImageApi")}
              </Link>
              <Link
                to={withLocale("/about", language)}
                activeOptions={{ exact: true }}
                aria-current={isAbout ? "page" : undefined}
                className={navLinkClass}
              >
                {t("ui.navAbout")}
              </Link>
            </FluidHoverControls>
          )}
        </div>

        <FluidHoverControls compact>
          {isMobile ? (
            <Drawer open={downloadOpen} onOpenChange={setDownloadOpen}>
              <DrawerTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className={actionClass}
                    aria-label={t("ui.downloadFont")}
                  >
                    <FileArrowDownIcon aria-hidden="true" />
                  </Button>
                }
              />
              <DrawerContent>
                <DrawerHeader className="border-border border-b pb-4">
                  <DrawerTitle>{t("ui.downloadFont")}</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-1 px-4 pt-4 pb-6">
                  {fontDownloads.map((font) => (
                    <button
                      key={font.labelKey}
                      type="button"
                      className="flex min-h-10 items-center justify-between gap-3 rounded-lg px-3 text-left text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                      onClick={() => {
                        setDownloadOpen(false);
                        void downloadFont(font.url);
                      }}
                    >
                      {t(font.labelKey)}
                      <Badge variant="secondary">{FONT_VERSION}</Badge>
                    </button>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <HeaderActionDropdown
              label={t("ui.downloadFont")}
              icon={<FileArrowDownIcon aria-hidden="true" />}
              className={actionClass}
              items={fontDownloads.map((font) => ({
                id: font.labelKey,
                label: t(font.labelKey),
                suffix: <Badge variant="secondary">{FONT_VERSION}</Badge>,
                onSelect: () => downloadFont(font.url),
              }))}
            />
          )}

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={GITHUB_LABEL[language]}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              actionClass
            )}
          >
            <GithubLogoIcon className="size-4" aria-hidden="true" />
          </a>

          {isMobile ? (
            <Drawer open={languageOpen} onOpenChange={setLanguageOpen}>
              <DrawerTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className={actionClass}
                    aria-label={t("ui.language")}
                  >
                    <TranslateIcon aria-hidden="true" />
                  </Button>
                }
              />
              <DrawerContent>
                <DrawerHeader className="border-border border-b pb-4">
                  <DrawerTitle>{t("ui.language")}</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-1 px-4 pt-4 pb-6">
                  {languages.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      lang={lang.value}
                      aria-current={
                        language === lang.value ? "true" : undefined
                      }
                      className="flex min-h-10 items-center justify-between rounded-lg px-3 text-left text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=true]:bg-muted"
                      onClick={() => {
                        setLanguageOpen(false);
                        handleLanguageChange(lang.value);
                      }}
                    >
                      {lang.label}
                      {language === lang.value && (
                        <CheckIcon aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <HeaderActionDropdown
              label={t("ui.language")}
              icon={<TranslateIcon aria-hidden="true" />}
              className={actionClass}
              selectedId={language}
              items={languages.map((lang) => ({
                id: lang.value,
                label: lang.label,
                onSelect: () => handleLanguageChange(lang.value),
              }))}
            />
          )}
          <ThemeToggle className={actionClass} />
        </FluidHoverControls>
      </nav>
    </header>
  );
}

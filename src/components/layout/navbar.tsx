import {
  CheckIcon,
  FileArrowDownIcon,
  GithubLogoIcon,
  ListIcon,
} from "@phosphor-icons/react";
import { ActionMenu } from "@rutopio/base-component/action-menu";
import { Badge } from "@rutopio/base-component/badge";
import { Button, buttonVariants } from "@rutopio/base-component/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@rutopio/base-component/drawer";
import { LanguageToggle } from "@rutopio/base-component/language-toggle";
import {
  HeaderNavigation,
  SiteHeader,
} from "@rutopio/base-component/site-header";
import { useIsMobile } from "@rutopio/base-component/use-mobile";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLang } from "@/hooks/use-lang";
import { fontDownloads, GITHUB_REPO_URL, languages } from "@/lib/constants";
import { type Locale, stripLocale, withLocale } from "@/lib/locale";

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
  const [downloadOpen, setDownloadOpen] = useState(false);

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
    <SiteHeader
      className="bg-background font-heading"
      label={
        language === "ja"
          ? "メインナビゲーション"
          : language === "en"
            ? "Main navigation"
            : language === "zh-TW"
              ? "主要導覽"
              : "主要导航"
      }
      brand={
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
      }
      navigation={
        <HeaderNavigation
          items={[
            {
              id: "home",
              label: t("ui.navHome"),
              href: withLocale("/", language),
              active: isHome,
            },
            {
              id: "api",
              label: t("ui.navImageApi"),
              href: withLocale("/api", language),
              active: isApi,
            },
            {
              id: "about",
              label: t("ui.navAbout"),
              href: withLocale("/about", language),
              active: isAbout,
            },
          ]}
          label={t("ui.navMenu")}
          title="Mahjong Font"
          menuIcon={<ListIcon aria-hidden="true" />}
          selectedIcon={<CheckIcon aria-hidden="true" />}
          renderLink={(item, props) => (
            <Link
              to={item.href}
              activeOptions={{ exact: true }}
              aria-current={props.ariaCurrent}
              onClick={props.onClick}
              className={props.className}
            >
              {props.children}
            </Link>
          )}
        />
      }
      actions={
        <>
          {isMobile ? (
            <Drawer open={downloadOpen} onOpenChange={setDownloadOpen}>
              <DrawerTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
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
            <ActionMenu
              label={t("ui.downloadFont")}
              trigger={<FileArrowDownIcon aria-hidden="true" />}
              items={fontDownloads.map((font) => ({
                id: font.labelKey,
                label: t(font.labelKey),
                trailing: <Badge variant="secondary">{FONT_VERSION}</Badge>,
                onSelect: () => downloadFont(font.url),
              }))}
            />
          )}

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={GITHUB_LABEL[language]}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <GithubLogoIcon className="size-4" aria-hidden="true" />
          </a>

          <LanguageToggle
            label={t("ui.language")}
            current={language}
            options={languages.map((lang) => ({
              value: lang.value as Locale,
              label: lang.label,
              htmlLang: lang.value,
            }))}
            isMobile={isMobile}
            onChange={(value) => handleLanguageChange(value)}
          />
          <ThemeToggle />
        </>
      }
    />
  );
}

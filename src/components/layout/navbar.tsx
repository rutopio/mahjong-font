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

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useLang } from "@/hooks/use-lang";
import { useIsMobile } from "@/hooks/use-mobile";
import { fontDownloads, GITHUB_REPO_URL, languages } from "@/lib/constants";
import { type Locale, withLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const navLinkClass =
  "flex h-9 items-center whitespace-nowrap rounded-lg px-3 font-medium text-base text-foreground hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-muted";
const actionClass =
  "cursor-default rounded-lg transition-[background-color,border-color,color,opacity,box-shadow,scale] duration-150 ease-in-out hover:bg-hover active:scale-[0.96] max-[359px]:size-8";
const FONT_VERSION = "v2.1";

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pathname = useLocation({ select: (l) => l.pathname });
  const language = useLang();
  const isHome =
    pathname.replace(/\/$/, "") ===
    withLocale("/", language).replace(/\/$/, "");
  const isApi = pathname === withLocale("/api", language);
  const isAbout = pathname === withLocale("/about", language);
  const isMobile = useIsMobile();
  const [langDrawerOpen, setLangDrawerOpen] = useState(false);
  const [fontDrawerOpen, setFontDrawerOpen] = useState(false);

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
        aria-label="Main navigation"
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
            <DropdownMenu>
              <DropdownMenuTrigger
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
              <DropdownMenuContent align="start" className="min-w-40">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    aria-current={isHome ? "page" : undefined}
                    className="justify-between px-3"
                    onClick={() => navigate({ to: withLocale("/", language) })}
                  >
                    {t("ui.navHome")}
                    {isHome && <CheckIcon aria-hidden="true" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    aria-current={isApi ? "page" : undefined}
                    className="justify-between px-3"
                    onClick={() =>
                      navigate({ to: withLocale("/api", language) })
                    }
                  >
                    {t("ui.navImageApi")}
                    {isApi && <CheckIcon aria-hidden="true" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    aria-current={isAbout ? "page" : undefined}
                    className="justify-between px-3"
                    onClick={() =>
                      navigate({ to: withLocale("/about", language) })
                    }
                  >
                    {t("ui.navAbout")}
                    {isAbout && <CheckIcon aria-hidden="true" />}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={withLocale("/", language)}
                activeOptions={{ exact: true, includeSearch: false }}
                aria-current={isHome ? "page" : undefined}
                className={cn(navLinkClass, isHome && "bg-muted")}
              >
                {t("ui.navHome")}
              </Link>
              <Link
                to={withLocale("/api", language)}
                activeOptions={{ exact: true }}
                activeProps={{ "aria-current": "page" as const }}
                className={navLinkClass}
              >
                {t("ui.navImageApi")}
              </Link>
              <Link
                to={withLocale("/about", language)}
                activeOptions={{ exact: true }}
                activeProps={{ "aria-current": "page" as const }}
                className={navLinkClass}
              >
                {t("ui.navAbout")}
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-0 min-[360px]:gap-2">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository (opens in a new tab)"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              actionClass
            )}
          >
            <GithubLogoIcon className="size-4" aria-hidden="true" />
          </a>

          {isMobile ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className={actionClass}
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
                        className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-sm hover:bg-accent"
                        onClick={() => {
                          downloadFont(font.url);
                          setFontDrawerOpen(false);
                        }}
                      >
                        {t(font.labelKey)}
                        <Badge variant="secondary">{FONT_VERSION}</Badge>
                      </button>
                    ))}
                  </div>
                  <DrawerFooter>
                    <DrawerClose
                      render={
                        <Button variant="outline">{t("ui.close")}</Button>
                      }
                    />
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className={actionClass}
                    aria-label={t("ui.downloadFont")}
                  >
                    <FileArrowDownIcon aria-hidden="true" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {fontDownloads.map((font) => (
                    <DropdownMenuItem
                      key={font.labelKey}
                      className="justify-between gap-6"
                      onClick={() => downloadFont(font.url)}
                    >
                      {t(font.labelKey)}
                      <Badge variant="secondary">{FONT_VERSION}</Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isMobile ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className={actionClass}
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
                    <DrawerClose
                      render={
                        <Button variant="outline">{t("ui.close")}</Button>
                      }
                    />
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className={actionClass}
                    aria-label={t("ui.language")}
                  >
                    <TranslateIcon aria-hidden="true" />
                  </Button>
                }
              />
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
        </div>
      </nav>
    </header>
  );
}

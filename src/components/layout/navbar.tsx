import {
  CheckIcon,
  FileArrowDownIcon,
  GithubLogoIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
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
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useLang } from "@/hooks/use-lang";
import { useIsMobile } from "@/hooks/use-mobile";
import { fontDownloads, GITHUB_REPO_URL, languages } from "@/lib/constants";
import { type Locale, withLocale } from "@/lib/locale";

const navLinkClass =
  "inline-flex h-9 items-center rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground";

const FONT_VERSION = "v2.1";

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pathname = useLocation({ select: (l) => l.pathname });
  // Active locale comes from the URL (the source of truth), not i18next state.
  const language = useLang();
  const isMobile = useIsMobile();
  const [langDrawerOpen, setLangDrawerOpen] = useState(false);
  const [fontDrawerOpen, setFontDrawerOpen] = useState(false);

  const downloadFont = (filePath: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath;
    link.click();
  };

  // Switching language is a soft navigation to the same page under the target
  // locale's prefix (no reload). LangSync in __root then syncs i18next.
  const handleLanguageChange = (value: string) => {
    navigate({ to: withLocale(pathname, value as Locale) });
  };

  return (
    <nav
      className="container h-fit w-full bg-background p-4 lg:p-12"
      aria-label="Main navigation"
    >
      <div className="flex h-full w-full items-center justify-between gap-0 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to={withLocale("/", language)}
            aria-label="Home"
            className="shrink-0"
          >
            <img
              src="/icon.svg"
              alt=""
              className="size-8 transition-transform hover:scale-110"
            />
          </Link>
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {/* Home is desktop-only; the logo already links home on mobile. */}
              <NavigationMenuItem className="hidden lg:flex">
                <NavigationMenuLink
                  className={navLinkClass}
                  render={
                    <Link
                      to={withLocale("/", language)}
                      activeOptions={{ exact: true, includeSearch: false }}
                      activeProps={{
                        className: "bg-accent",
                        "aria-current": "page" as const,
                      }}
                    >
                      {t("ui.navHome")}
                    </Link>
                  }
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navLinkClass}
                  render={
                    <Link
                      to={withLocale("/api", language)}
                      activeProps={{
                        className: "bg-accent",
                        "aria-current": "page" as const,
                      }}
                    >
                      {t("ui.navImageApi")}
                    </Link>
                  }
                />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
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
                    type="button"
                    className="rounded-full sm:rounded-md"
                    aria-label={t("ui.language")}
                  >
                    <TranslateIcon aria-hidden="true" />
                    <span className="hidden lg:block">{t("ui.language")}</span>
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
                    type="button"
                    className="rounded-full sm:rounded-md"
                    aria-label={t("ui.downloadFont")}
                  >
                    <FileArrowDownIcon aria-hidden="true" />
                    <span className="hidden lg:block">
                      {t("ui.downloadFont")}
                    </span>
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

          <Button
            variant="ghost"
            nativeButton={false}
            className="rounded-full sm:rounded-md"
            render={
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository, opens in new tab"
              >
                <GithubLogoIcon />
                <span className="flex items-center gap-0">
                  <span>rutopio</span>
                  <span className="hidden lg:block">{" / "}</span>
                  <span className="hidden lg:block">mahjong-font</span>
                </span>
              </a>
            }
          />
        </div>
      </div>
    </nav>
  );
}

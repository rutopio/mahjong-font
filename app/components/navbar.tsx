import { useTranslation } from "react-i18next";
import { FileDownIcon, FileType2Icon, LanguagesIcon } from "lucide-react";

import { GithubIcon } from "@/components/icon/github";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { t, i18n } = useTranslation();

  const downloadFont = (filePath: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath;
    link.click();
  };

  return (
    <div className="fixed top-4 -left-4 z-50 h-12 w-full bg-gray-50">
      <div className="flex h-full w-full items-center justify-end">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/rutopio/Japanese-Mahjong-Font-with-OpenType"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost">
              <GithubIcon />
              <span className="hidden md:block">Github</span>
            </Button>
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <FileType2Icon />
                <span className="hidden md:block">{t("downloadFont")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  downloadFont(
                    "https://raw.githubusercontent.com/rutopio/Japanese-Mahjong-Font-with-OpenType/main/public/fonts/Riichi-Mahjong-Mono.otf",
                  )
                }
              >
                <FileDownIcon />
                {t("monochromeFont")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  downloadFont(
                    "https://raw.githubusercontent.com/rutopio/Japanese-Mahjong-Font-with-OpenType/main/public/fonts/Riichi-Mahjong-Color.otf",
                  )
                }
              >
                <FileDownIcon />
                {t("colorfulFont")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <LanguagesIcon />
                <span className="hidden md:block">{t("language")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => i18n.changeLanguage("ja")}>
                日本語
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage("zh-TW")}>
                繁體中文
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage("zh-CN")}>
                简体中文
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

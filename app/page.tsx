"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import localFont from "next/font/local";
import {
  DicesIcon,
  DownloadIcon,
  InfoIcon,
  LinkIcon,
  PaletteIcon,
  Share2Icon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { FacebookIcon } from "@/components/icon/facebook";
import { ThreadsIcon } from "@/components/icon/threads";
import { XIcon } from "@/components/icon/x";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  copyLink,
  shareToFacebook,
  shareToThreads,
  shareToX,
} from "@/lib/share-link";
import { textToImage } from "@/lib/text-to-image";
import { transformString } from "@/lib/transform-string";

import { Navbar } from "./components/navbar";
import Notations from "./components/notations";
import { optionValues } from "./constants";

const monochromeFont = localFont({
  src: "../public/fonts/Riichi-Mahjong-Mono.otf",
  display: "swap",
  variable: "--font-riichi-mahjong-mono",
});

const colorfulFont = localFont({
  src: "../public/fonts/Riichi-Mahjong-Color.otf",
  display: "swap",
  variable: "--font-riichi-mahjong-color",
});

export default function Home() {
  const { t, ready } = useTranslation();
  const isMobile = useIsMobile();
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [theme, setTheme] = useState("monochrome");
  const renderedTextRef = useRef<HTMLDivElement>(null);
  const [showNotations, setShowNotations] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 如果 i18n 尚未準備好，顯示載入狀態
  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2Icon className="size-12 animate-spin" />
      </div>
    );
  }

  const handleShowNotations = () => {
    setShowNotations(!showNotations);
  };

  const encodeURL = (url: string) => {
    return url.replaceAll(" ", ".");
  };

  const decodeURL = (url: string) => {
    return url.replaceAll(".", " ");
  };

  // 初始化：從 hash 讀取或設置預設值
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const hash = window.location.hash.slice(1); // 移除 # 符號

      if (hash) {
        // 有 hash：直接使用 hash 中的內容
        const decodedInput = decodeURL(hash);
        setInput(decodedInput);
        setSelectedOption(""); // 不選擇任何預設選項
      } else {
        // 無 hash：設置預設值並跳轉
        const defaultInput = "19m19p19s1234567z_1m";
        setInput(defaultInput);
        setSelectedOption("kokushi");
        window.location.hash = encodeURL(defaultInput);
      }

      setIsInitialized(true);
    }
  }, [isInitialized]);

  // 當輸入改變時更新 hash（但只在初始化完成後）
  useEffect(() => {
    if (typeof window !== "undefined" && input && isInitialized) {
      const currentHash = window.location.hash.slice(1);
      const encodedInput = encodeURL(input);

      // 只有當 hash 與當前 input 不同時才更新
      if (currentHash !== encodedInput) {
        window.location.hash = encodedInput;
      }
    }
  }, [input, isInitialized]);

  const handleOptionChange = (value: string) => {
    const transformedValue = transformString(
      optionValues[value as keyof typeof optionValues]
    );
    setInput(transformedValue);
    // 設置選項後立即清除，讓下次可以顯示 placeholder
    setTimeout(() => setSelectedOption(""), 100);
  };

  return (
    <div
      className={`mx-auto flex h-screen w-full items-center justify-center gap-6 bg-gray-50 md:h-dvh ${monochromeFont.variable} ${colorfulFont.variable}`}
    >
      <Navbar />

      <div className="flex w-full flex-col items-center justify-center gap-8 p-4 lg:max-w-4xl">
        <div className="text-center text-2xl font-bold">{t("toolTitle")}</div>
        <div className="flex w-full flex-col items-center gap-4">
          <Input
            type="text"
            placeholder={t("placeholder")}
            className="h-12 w-full bg-white text-center text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <DicesIcon className="size-6" />
                <Select
                  value={selectedOption || undefined}
                  onValueChange={handleOptionChange}
                >
                  <SelectTrigger className="h-12 w-fit min-w-[180px] bg-white">
                    <SelectValue placeholder={t("examples")} />
                  </SelectTrigger>
                  <SelectContent
                    side="top"
                    align={isMobile ? "center" : "start"}
                  >
                    <SelectGroup>
                      <SelectLabel>{t("one_han")}</SelectLabel>
                      <SelectItem value="tanyao">{t("tanyao")}</SelectItem>
                      <SelectItem value="ipeiko">{t("ipeiko")}</SelectItem>
                      <SelectItem value="pinfu">{t("pinfu")}</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>{t("two_han")}</SelectLabel>
                      <SelectItem value="sanshoku_doujun">
                        {t("sanshoku_doujun")}
                      </SelectItem>
                      <SelectItem value="sanshoku_douko">
                        {t("sanshoku_douko")}
                      </SelectItem>
                      <SelectItem value="sankantsu">
                        {t("sankantsu")}
                      </SelectItem>
                      <SelectItem value="shosangen">
                        {t("shosangen")}
                      </SelectItem>
                      <SelectItem value="ikki_tsuukan">
                        {t("ikki_tsuukan")}
                      </SelectItem>
                      <SelectItem value="chanta">{t("chanta")}</SelectItem>
                      <SelectItem value="toitoi">{t("toitoi")}</SelectItem>
                      <SelectItem value="sananko">{t("sananko")}</SelectItem>
                      <SelectItem value="chitoi">{t("chitoi")}</SelectItem>
                      <SelectItem value="honro">{t("honro")}</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>{t("three_han")}</SelectLabel>
                      <SelectItem value="honiso">{t("honiso")}</SelectItem>
                      <SelectItem value="jyunchan">{t("jyunchan")}</SelectItem>
                      <SelectItem value="ryopee">{t("ryopee")}</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>{t("six_han")}</SelectLabel>
                      <SelectItem value="chiniso">{t("chiniso")}</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>{t("yakuman")}</SelectLabel>
                      <SelectItem value="kokushi">{t("kokushi")}</SelectItem>
                      <SelectItem value="chulen">{t("chulen")}</SelectItem>
                      <SelectItem value="suanko">{t("suanko")}</SelectItem>
                      <SelectItem value="suukantsu">
                        {t("suukantsu")}
                      </SelectItem>
                      <SelectItem value="daisangen">
                        {t("daisangen")}
                      </SelectItem>
                      <SelectItem value="daishushi">
                        {t("daishushi")}
                      </SelectItem>
                      <SelectItem value="syoushushi">
                        {t("syoushushi")}
                      </SelectItem>
                      <SelectItem value="tsuiso">{t("tsuiso")}</SelectItem>
                      <SelectItem value="ryuiso">{t("ryuiso")}</SelectItem>
                      <SelectItem value="chinroo">{t("chinroo")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <PaletteIcon className="size-6" />
                <Select defaultValue="monochrome" onValueChange={setTheme}>
                  <SelectTrigger className="h-12 w-fit min-w-[100px] bg-white">
                    <SelectValue placeholder={t("theme")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monochrome">
                      {t("monochrome")}
                    </SelectItem>
                    <SelectItem value="colorful">{t("colorful")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mx-auto flex items-center gap-2 md:mx-0">
              <Button onClick={handleShowNotations}>
                <InfoIcon />
                {t("howToUse")}
              </Button>
            </div>
          </div>
        </div>

        <div
          className="mx-auto mt-8 flex items-center text-center text-3xl leading-loose md:text-7xl"
          style={{
            fontFamily:
              theme === "monochrome"
                ? "var(--font-riichi-mahjong-mono)"
                : "var(--font-riichi-mahjong-color)",
          }}
          ref={renderedTextRef}
        >
          {transformString(input)}
        </div>

        {input && (
          <div className="flex gap-2">
            <Button
              onClick={() =>
                textToImage(
                  input,
                  renderedTextRef.current?.textContent || "",
                  renderedTextRef.current as HTMLDivElement
                )
              }
            >
              <DownloadIcon />
              {t("saveAsImage")}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Share2Icon />
                  {t("share")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => {
                    copyLink();
                    toast.success(t("linkCopied"), {
                      description: window.location.href,
                    });
                  }}
                >
                  <LinkIcon />
                  {t("copyLink")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToFacebook()}>
                  <FacebookIcon />
                  {t("shareOnFacebook")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToX()}>
                  <XIcon />
                  {t("shareOnX")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToThreads()}>
                  <ThreadsIcon />
                  {t("shareOnThreads")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {showNotations &&
        (isMobile ? (
          <Drawer open={showNotations} onOpenChange={setShowNotations}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-center text-2xl font-bold">
                  {t("howToUse")}
                </DrawerTitle>
              </DrawerHeader>
              <div className="overflow-auto p-4">
                <Notations theme={theme} />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Sheet open={showNotations} onOpenChange={setShowNotations}>
            <SheetContent className="min-w-1/2">
              <SheetHeader>
                <SheetTitle className="text-center text-2xl font-bold">
                  {t("howToUse")}
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-auto p-4">
                <Notations theme={theme} />
              </div>
            </SheetContent>
          </Sheet>
        ))}
    </div>
  );
}

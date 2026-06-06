import {
  CheckIcon,
  DownloadSimpleIcon,
  LinkIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { FacebookIcon } from "@/components/icon/facebook";
import { ThreadsIcon } from "@/components/icon/threads";
import { XIcon } from "@/components/icon/x";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  copyLink,
  shareToFacebook,
  shareToThreads,
  shareToX,
} from "@/lib/share-link";
import { downloadPng, downloadSvg } from "@/lib/tiles-export";

interface ActionButtonsProps {
  text: string;
  theme: string;
  tileColor: string;
}

const downloadOptions = [
  { labelKey: "ui.savePng", format: "png" },
  { labelKey: "ui.saveSvg", format: "svg" },
] as const;

const gridButtonClass =
  "h-auto flex-col gap-1.5 py-3 [&_svg:not([class*='size-'])]:size-6";

export function ActionButtons({ text, theme, tileColor }: ActionButtonsProps) {
  const { t } = useTranslation();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async (format: "png" | "svg") => {
    const filename = text || "mahjong";
    const opts = { text, theme, tileColor, filename };
    try {
      if (format === "svg") await downloadSvg(opts);
      else await downloadPng(opts);
    } catch {
      toast.error(t("ui.saveAsImage"));
    }
  };

  const handleCopy = () => {
    copyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // On touch devices, prefer the native share sheet; otherwise open the dialog.
  // navigator.share only exists on secure origins, so dev over LAN falls back.
  const handleShareClick = async () => {
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouch && navigator.share) {
      try {
        await navigator.share({
          title: t("ui.toolTitle"),
          url: window.location.href,
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    setShareOpen(true);
  };

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <DownloadSimpleIcon aria-hidden="true" />
            {t("ui.saveAsImage")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {downloadOptions.map((option) => (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleDownload(option.format)}
            >
              <DownloadSimpleIcon aria-hidden="true" />
              {t(option.labelKey)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" className="bg-white" onClick={handleShareClick}>
        <ShareNetworkIcon aria-hidden="true" />
        {t("share.share")}
      </Button>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("share.shareTitle")}</DialogTitle>
            <DialogDescription>{t("share.shareDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={shareToFacebook}
            >
              <FacebookIcon aria-hidden="true" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={shareToX}
            >
              <XIcon aria-hidden="true" />
              <span className="text-xs">X</span>
            </Button>
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={shareToThreads}
            >
              <ThreadsIcon aria-hidden="true" />
              <span className="text-xs">Threads</span>
            </Button>
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={handleCopy}
            >
              {copied ? (
                <CheckIcon aria-hidden="true" />
              ) : (
                <LinkIcon aria-hidden="true" />
              )}
              <span className="text-xs">
                {copied ? t("share.copied") : t("share.copyLink")}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

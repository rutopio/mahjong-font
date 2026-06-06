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
import { TileSvg } from "@/components/mahjong/tile-svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const gridButtonClass =
  "h-auto flex-col gap-1.5 py-3 [&_svg:not([class*='size-'])]:size-6";

export function ActionButtons({ text, theme, tileColor }: ActionButtonsProps) {
  const { t } = useTranslation();
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async (format: "png" | "svg") => {
    const filename = text || "mahjong";
    const opts = { text, theme, tileColor, filename };
    try {
      if (format === "svg") await downloadSvg(opts);
      else await downloadPng(opts);
      setDownloadOpen(false);
    } catch {
      toast.error(t("ui.saveAsImage"));
    }
  };

  const preview = (
    <div className="flex items-center justify-center overflow-hidden p-2">
      <TileSvg
        text={text}
        theme={theme}
        tileColor={tileColor}
        ariaLabel={t("ui.mahjongPreview")}
        className="[&>svg]:h-auto [&>svg]:max-h-32 [&>svg]:w-full"
      />
    </div>
  );

  const handleCopy = () => {
    copyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // On touch devices, only use the native share sheet (no dialog fallback);
  // pointer-based devices (desktop) always open the dialog.
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
      } catch {
        // User cancelled or share failed; do nothing.
      }
      return;
    }
    setShareOpen(true);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => setDownloadOpen(true)}>
        <DownloadSimpleIcon aria-hidden="true" />
        {t("ui.saveAsImage")}
      </Button>

      <Button variant="outline" className="bg-white" onClick={handleShareClick}>
        <ShareNetworkIcon aria-hidden="true" />
        {t("share.share")}
      </Button>

      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("ui.saveAsImage")}</DialogTitle>
            <DialogDescription>{t("ui.saveDescription")}</DialogDescription>
          </DialogHeader>
          {preview}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={() => handleDownload("png")}
            >
              <DownloadSimpleIcon aria-hidden="true" />
              <span className="text-xs">PNG</span>
            </Button>
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={() => handleDownload("svg")}
            >
              <DownloadSimpleIcon aria-hidden="true" />
              <span className="text-xs">SVG</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("share.shareTitle")}</DialogTitle>
            <DialogDescription>{t("share.shareDescription")}</DialogDescription>
          </DialogHeader>
          {preview}
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

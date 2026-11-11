import {
  ArrowSquareOutIcon,
  CheckIcon,
  DownloadSimpleIcon,
  FacebookLogoIcon,
  LinkIcon,
  ShareNetworkIcon,
  ThreadsLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import { Button } from "@rutopio/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@rutopio/ui/dialog";
import { useMountEffect } from "@rutopio/ui/use-mount-effect";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { TileSvg } from "@/components/mahjong/tile-svg";
import { isTouchDevice } from "@/lib/is-touch-device";
import {
  copyLink,
  shareToFacebook,
  shareToThreads,
  shareToX,
} from "@/lib/share-link";
import { downloadJpg, downloadPng, downloadSvg } from "@/lib/tiles-export";
import { encodeToQuery } from "@/lib/url-state";

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
  const copyTimer = useRef<number | undefined>(undefined);
  const mounted = useRef(false);
  useMountEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(copyTimer.current);
    };
  });

  const handleDownload = async (format: "png" | "jpg" | "svg") => {
    const filename = text || "mahjong";
    const opts = { text, theme, tileColor, filename };
    try {
      if (format === "svg") await downloadSvg(opts);
      else if (format === "jpg") await downloadJpg(opts);
      else await downloadPng(opts);
      setDownloadOpen(false);
    } catch {
      toast.error(t("ui.saveAsImage"));
    }
  };

  // File sharing lets touch users save directly to Photos; desktop uses the format dialog.
  const handleDownloadClick = () => {
    if (isTouchDevice()) {
      void handleDownload("png");
      return;
    }
    setDownloadOpen(true);
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

  const openImgPage = () => {
    const params = new URLSearchParams(
      encodeToQuery({ input: text, theme, tileColor })
    );
    params.delete("tile");
    const query = params.toString();
    const url = `/img/${encodeURIComponent(text)}${query ? `?${query}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    try {
      await copyLink();
      if (!mounted.current) return;
      window.clearTimeout(copyTimer.current);
      setCopied(true);
      copyTimer.current = window.setTimeout(() => {
        copyTimer.current = undefined;
        setCopied(false);
      }, 2000);
    } catch {
      toast.error(t("imgApi.copyFailed"));
    }
  };

  const handleShareClick = async () => {
    if (isTouchDevice() && navigator.share) {
      try {
        await navigator.share({
          title: t("ui.toolTitle"),
          url: window.location.href,
        });
      } catch {
        // Dismissing the native share sheet should not open another dialog.
      }
      return;
    }
    setShareOpen(true);
  };

  return (
    <div className="inline-grid grid-cols-2 gap-2">
      <Button onClick={handleDownloadClick}>
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
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={() => handleDownload("png")}
            >
              <DownloadSimpleIcon aria-hidden="true" />
              <span>PNG</span>
            </Button>
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={() => handleDownload("jpg")}
            >
              <DownloadSimpleIcon aria-hidden="true" />
              <span>JPG</span>
            </Button>
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={() => handleDownload("svg")}
            >
              <DownloadSimpleIcon aria-hidden="true" />
              <span>SVG</span>
            </Button>
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={openImgPage}
              aria-label={t("ui.openImageApiNewTab")}
            >
              <ArrowSquareOutIcon aria-hidden="true" />
              <span>{t("ui.navImageApi")}</span>
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
              <FacebookLogoIcon aria-hidden="true" />
              <span>Facebook</span>
            </Button>
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={shareToX}
            >
              <XLogoIcon aria-hidden="true" />
              <span>X</span>
            </Button>
            <Button
              variant="outline"
              className={gridButtonClass}
              onClick={shareToThreads}
            >
              <ThreadsLogoIcon aria-hidden="true" />
              <span>Threads</span>
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
              <span>{copied ? t("share.copied") : t("share.copyLink")}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

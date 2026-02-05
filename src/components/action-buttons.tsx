"use client";

import { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { DownloadIcon, LinkIcon, Share2Icon } from "lucide-react";
import { toast } from "sonner";

import { FacebookIcon } from "@/components/icon/facebook";
import { ThreadsIcon } from "@/components/icon/threads";
import { XIcon } from "@/components/icon/x";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  copyLink,
  shareToFacebook,
  shareToThreads,
  shareToX,
} from "@/lib/share-link";
import { textToImage } from "@/lib/text-to-image";

const shareOptions = [
  { labelKey: "copyLink", icon: LinkIcon, action: "copy" },
  { labelKey: "shareOnFacebook", icon: FacebookIcon, action: "facebook" },
  { labelKey: "shareOnX", icon: XIcon, action: "x" },
  { labelKey: "shareOnThreads", icon: ThreadsIcon, action: "threads" },
] as const;

interface ActionButtonsProps {
  renderedTextRef: RefObject<HTMLDivElement | null>;
}

export function ActionButtons({ renderedTextRef }: ActionButtonsProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const handleDownload = () => {
    if (!renderedTextRef.current) return;
    textToImage(
      renderedTextRef.current.textContent || "mahjong",
      renderedTextRef.current
    );
  };

  const handleShare = (action: string) => {
    if (action === "copy") {
      copyLink();
      toast.success(t("linkCopied"), {
        description: window.location.href,
      });
    } else if (action === "facebook") {
      shareToFacebook();
    } else if (action === "x") {
      shareToX();
    } else if (action === "threads") {
      shareToThreads();
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      // Fallback to copy link if Web Share API not supported
      copyLink();
      toast.success(t("linkCopied"), {
        description: window.location.href,
      });
      return;
    }

    try {
      await navigator.share({
        title: t("toolTitle"),
        text: t("toolTitle"),
        url: window.location.href,
      });
    } catch (err) {
      // Ignore if user cancelled the share
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleDownload}>
        <DownloadIcon />
        {t("saveAsImage")}
      </Button>

      {isMobile ? (
        <Button variant="outline" onClick={handleNativeShare}>
          <Share2Icon />
          {t("share")}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white">
              <Share2Icon />
              {t("share")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {shareOptions.map((option) => (
              <DropdownMenuItem
                key={option.action}
                onClick={() => handleShare(option.action)}
              >
                <option.icon />
                {t(option.labelKey)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

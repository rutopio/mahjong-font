import {
  FacebookLogoIcon,
  LinkIcon,
  ShareNetworkIcon,
  ThreadsLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import { Button } from "@rutopio/base-component/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@rutopio/base-component/dialog";
import { Input } from "@rutopio/base-component/input";
import {
  openShareWindow,
  usePageShare,
} from "@rutopio/base-component/page-share";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function ApiShareButton({
  size = "icon",
}: {
  size?: "icon" | "icon-lg";
}) {
  const { t } = useTranslation();
  const { open, setOpen, shareUrl, targets, copy, share } = usePageShare({
    onCopied: (url) =>
      toast.success(t("share.linkCopied"), { description: url }),
    onCopyError: () => toast.error(t("imgApi.copyFailed")),
  });

  return (
    <>
      <Button
        variant="outline"
        size={size}
        aria-label={t("share.share")}
        onClick={share}
      >
        <ShareNetworkIcon aria-hidden="true" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("share.shareTitle")}</DialogTitle>
            <DialogDescription>{t("share.shareDescription")}</DialogDescription>
          </DialogHeader>
          <Input
            value={shareUrl}
            disabled
            aria-label={t("apiActions.currentUrl")}
            className="bg-muted"
          />
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 py-3 [&_svg:not([class*='size-'])]:size-6"
              onClick={() => openShareWindow(targets[0].url)}
            >
              <FacebookLogoIcon aria-hidden="true" />
              <span className="text-sm">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 py-3 [&_svg:not([class*='size-'])]:size-6"
              onClick={() => openShareWindow(targets[1].url)}
            >
              <XLogoIcon aria-hidden="true" />
              <span className="text-sm">X</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 py-3 [&_svg:not([class*='size-'])]:size-6"
              onClick={() => openShareWindow(targets[2].url)}
            >
              <ThreadsLogoIcon aria-hidden="true" />
              <span className="text-sm">Threads</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 py-3 [&_svg:not([class*='size-'])]:size-6"
              onClick={copy}
            >
              <LinkIcon aria-hidden="true" />
              <span className="text-sm">{t("share.copyLink")}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

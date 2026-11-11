import { Button } from "@rutopio/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@rutopio/ui/drawer";
import { useIsMobile } from "@rutopio/ui/use-mobile";
import { useTranslation } from "react-i18next";
import { Notations } from "@/components/mahjong/notations";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NotationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: string;
}

export function NotationsModal({
  open,
  onOpenChange,
  theme,
}: NotationsModalProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("ui.howToUse")}</DrawerTitle>
            <DrawerDescription className="sr-only">
              {t("ui.howToUse")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-auto p-2">
            <Notations theme={theme} />
          </div>
          <DrawerFooter>
            <DrawerClose
              render={<Button variant="outline">{t("ui.close")}</Button>}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-[50%] sm:min-w-[600px]">
        <SheetHeader>
          <SheetTitle>{t("ui.howToUse")}</SheetTitle>
          <SheetDescription className="sr-only">
            {t("ui.howToUse")}
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-auto p-4">
          <Notations theme={theme} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

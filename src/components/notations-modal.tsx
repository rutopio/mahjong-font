"use client";

import { useTranslation } from "react-i18next";

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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

import Notations from "@/app/sections/notations";

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
            <DrawerTitle className="text-center text-xl font-bold">
              {t("howToUse")}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              {t("howToUse")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-auto p-4">
            <Notations theme={theme} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{t("close")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-[50%] sm:min-w-[600px]">
        <SheetHeader>
          <SheetTitle className="text-center text-2xl font-bold">
            {t("howToUse")}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t("howToUse")}
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-auto p-4">
          <Notations theme={theme} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

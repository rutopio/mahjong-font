import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BookmarkSimpleIcon, CaretDownIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { yakuGroups } from "@/lib/constants";
import { cn } from "@/lib/utils";

function YakuCommandList({
  selectedOption,
  onSelect,
  commandClassName,
  listClassName,
}: {
  selectedOption: string;
  onSelect: (item: string) => void;
  commandClassName?: string;
  listClassName?: string;
}) {
  const { t } = useTranslation();
  return (
    <Command className={commandClassName}>
      <CommandInput placeholder={t("ui.examples")} />
      <CommandList className={listClassName}>
        <CommandEmpty>{t("ui.examples")}</CommandEmpty>
        {yakuGroups.map((group, index) => (
          <div key={group.labelKey}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={t(group.labelKey)}>
              {group.items.map((item) => (
                <CommandItem
                  key={item}
                  value={t(item)}
                  data-checked={selectedOption === item}
                  onSelect={() => onSelect(item)}
                >
                  {t(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </Command>
  );
}

interface YakuSelectorProps {
  selectedOption: string;
  onOptionChange: (value: string) => void;
}

export function YakuSelector({
  selectedOption,
  onOptionChange,
}: YakuSelectorProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const selectedLabel = selectedOption
    ? yakuGroups.flatMap((g) => g.items).includes(selectedOption)
      ? t(selectedOption).replace(/\s*\(.*\)$/, "")
      : undefined
    : undefined;

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      aria-label={t("ui.examples")}
      className="w-fit min-w-[180px] justify-between border-input bg-white px-3 font-normal hover:bg-white"
      onClick={() => isMobile && setOpen(true)}
    >
      <BookmarkSimpleIcon aria-hidden="true" />
      <span
        className={cn("truncate", !selectedLabel && "text-muted-foreground")}
      >
        {selectedLabel ?? t("ui.examples")}
      </span>
      <CaretDownIcon
        aria-hidden="true"
        className="shrink-0 text-muted-foreground/80"
      />
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t("ui.examples")}</DrawerTitle>
              <DrawerDescription className="sr-only">
                {t("ui.examples")}
              </DrawerDescription>
            </DrawerHeader>
            <div className="overflow-auto p-2">
              <YakuCommandList
                selectedOption={selectedOption}
                commandClassName="bg-background"
                listClassName="max-h-none"
                onSelect={(item) => {
                  onOptionChange(item);
                  setOpen(false);
                }}
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">{t("ui.close")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="gap-0 p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>{t("ui.examples")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("ui.examples")}
          </DialogDescription>
        </DialogHeader>
        <YakuCommandList
          selectedOption={selectedOption}
          listClassName="max-h-[60vh]"
          onSelect={(item) => {
            onOptionChange(item);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

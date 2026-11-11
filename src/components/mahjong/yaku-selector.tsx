import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@rutopio/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@rutopio/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@rutopio/ui/drawer";
import { useIsNarrowViewport } from "@rutopio/ui/use-is-narrow-viewport";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { yakuGroups } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PARENTHETICAL_SUFFIX_RE = /\s*\(.*\)$/;

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
  const isNarrowViewport = useIsNarrowViewport();
  const [open, setOpen] = useState(false);

  const selectedLabel = selectedOption
    ? yakuGroups.flatMap((g) => g.items).includes(selectedOption)
      ? t(selectedOption).replace(PARENTHETICAL_SUFFIX_RE, "")
      : undefined
    : undefined;

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      aria-label={t("ui.examples")}
      className="border-input bg-background hover:bg-muted w-fit min-w-[180px] justify-start px-3 font-normal"
      onClick={() => isNarrowViewport && setOpen(true)}
    >
      <BookmarkSimpleIcon aria-hidden="true" />
      <span
        className={cn("truncate", !selectedLabel && "text-muted-foreground")}
      >
        {selectedLabel ?? t("ui.examples")}
      </span>
    </Button>
  );

  if (isNarrowViewport) {
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
              <DrawerClose
                render={<Button variant="outline">{t("ui.close")}</Button>}
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={triggerButton} />
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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckIcon, ChevronDownIcon, LibraryBigIcon } from "lucide-react";

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
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
            <CommandInput placeholder={t("examples")} />
            <CommandList className={listClassName}>
                <CommandEmpty>{t("examples")}</CommandEmpty>
                {yakuGroups.map((group, index) => (
                    <div key={group.labelKey}>
                        {index > 0 && <CommandSeparator />}
                        <CommandGroup heading={t(group.labelKey)}>
                            {group.items.map((item) => (
                                <CommandItem
                                    key={item}
                                    value={t(item)}
                                    onSelect={() => onSelect(item)}
                                >
                                    {t(item)}
                                    {selectedOption === item && (
                                        <CheckIcon size={16} className="ml-auto" />
                                    )}
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

export function YakuSelector({ selectedOption, onOptionChange }: YakuSelectorProps) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);

    const selectedLabel = selectedOption
        ? yakuGroups.flatMap((g) => g.items).includes(selectedOption)
            ? t(selectedOption)
            : undefined
        : undefined;

    const triggerButton = (
        <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={t("examples")}
            className="w-fit min-w-[180px] justify-between border-input bg-white px-3 font-normal hover:bg-white"
            onClick={() => isMobile && setOpen(true)}
        >
            <LibraryBigIcon aria-hidden="true" />
            <span className={cn("truncate", !selectedLabel && "text-muted-foreground")}>
                {selectedLabel ?? t("examples")}
            </span>
            <ChevronDownIcon size={16} aria-hidden="true" className="shrink-0 text-muted-foreground/80" />
        </Button>
    );

    if (isMobile) {
        return (
            <>
                {triggerButton}
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>{t("examples")}</DrawerTitle>
                            <DrawerDescription className="sr-only">{t("examples")}</DrawerDescription>
                        </DrawerHeader>
                        <div className="overflow-auto px-4">
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
                                <Button variant="outline">{t("close")}</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-[var(--radix-popper-anchor-width)] min-w-[180px] border-input p-0"
            >
                <YakuCommandList
                    selectedOption={selectedOption}
                    onSelect={(item) => {
                        onOptionChange(item);
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

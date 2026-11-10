import { CheckIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId, useMemo, useRef, useState } from "react";
import { FluidHoverHighlight } from "@/components/fluid-hover-highlight";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFluidHover } from "@/hooks/use-fluid-hover";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { spring } from "@/lib/springs";
import { cn } from "@/lib/utils";

export type HeaderActionItem = {
  id: string;
  label: string;
  suffix?: ReactNode;
  onSelect: () => void;
};

export function HeaderActionDropdown({
  label,
  icon,
  items,
  selectedId,
  className,
}: {
  label: string;
  icon: ReactNode;
  items: HeaderActionItem[];
  selectedId?: string;
  className?: string;
}) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const openModeRef = useRef<"hover" | "click" | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const focusFrame = useRef<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hover = useFluidHover(listRef, { axis: "y", nearest: true });
  const itemRefCallbacks = useMemo(
    () =>
      items.map((_, index) => (element: HTMLButtonElement | null) => {
        itemRefs.current[index] = element;
        hover.registerItem(index, element);
      }),
    [items, hover.registerItem]
  );

  const close = (restoreFocus = false) => {
    clearTimeout(timer.current);
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
    openRef.current = false;
    openModeRef.current = null;
    setOpen(false);
    hover.setActiveIndex(null);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const openMenu = (mode: "hover" | "click", focus = false) => {
    clearTimeout(timer.current);
    if (openRef.current && mode === "hover") return;
    const index = Math.max(
      0,
      items.findIndex((item) => item.id === selectedId)
    );
    if (!openRef.current) {
      setFocusedIndex(index);
      openRef.current = true;
      openModeRef.current = mode;
      setOpen(true);
    } else if (mode === "click") {
      openModeRef.current = "click";
      if (focus) setFocusedIndex(index);
    }
    if (focus) {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
      focusFrame.current = requestAnimationFrame(() => {
        focusFrame.current = null;
        itemRefs.current[index]?.focus();
      });
    }
  };

  useMountEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (openRef.current && !rootRef.current?.contains(event.target as Node))
        close();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      clearTimeout(timer.current);
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    };
  });

  const move = (index: number) => {
    const next = (index + items.length) % items.length;
    setFocusedIndex(next);
    hover.setActiveIndex(next);
    openMenu("click");
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      itemRefs.current[next]?.focus();
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      move(openRef.current ? focusedIndex + 1 : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(openRef.current ? focusedIndex - 1 : items.length - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(items.length - 1);
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: A fieldset changes the nested button layout and form behavior.
    <div
      ref={rootRef}
      role="group"
      aria-label={label}
      className="relative"
      onMouseEnter={() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => openMenu("hover"), 200);
      }}
      onMouseLeave={() => {
        if (openModeRef.current !== "click") close();
      }}
      onBlurCapture={(event) => {
        if (
          openModeRef.current !== "click" &&
          !rootRef.current?.contains(event.relatedTarget as Node | null)
        )
          close();
      }}
    >
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon"
        className={className}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() =>
          openRef.current && openModeRef.current === "click"
            ? close()
            : openMenu("click", true)
        }
        onKeyDown={onKeyDown}
      >
        {icon}
      </Button>
      <AnimatePresence>
        {open && (
          <div className="absolute top-full right-0 z-50 min-w-48 pt-2 sm:min-w-56">
            <motion.div
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: -4 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: -4,
                transition: spring.fast.exit,
              }}
              transition={spring.fast}
              style={{ transformOrigin: "top right" }}
              className="rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <ScrollArea
                scrollFade
                overscrollContain
                className="h-auto! max-h-[calc(50dvh-0.625rem)] w-full [&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:right-[-3px]! [&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:w-1! [&_[data-slot=scroll-area-scrollbar]]:m-0.5 [&_[data-slot=scroll-area-thumb]]:bg-foreground/10! [&_[data-slot=scroll-area-viewport]]:max-h-[calc(50dvh-0.625rem)] data-has-overflow-y:[&_[role=menu]]:pr-2"
              >
                <div
                  ref={listRef}
                  id={id}
                  role="menu"
                  aria-label={label}
                  onKeyDown={onKeyDown}
                  {...hover.handlers}
                  className="relative"
                >
                  <FluidHoverHighlight hover={hover} className="rounded-md" />
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      ref={itemRefCallbacks[index]}
                      type="button"
                      role="menuitem"
                      aria-current={selectedId === item.id ? "true" : undefined}
                      onPointerMove={() => setFocusedIndex(index)}
                      onFocus={() => {
                        setFocusedIndex(index);
                        hover.setActiveIndex(index);
                      }}
                      onClick={() => {
                        close(true);
                        item.onSelect();
                      }}
                      className={cn(
                        "relative flex min-h-8 w-full items-center justify-between gap-3 whitespace-nowrap rounded-md px-2.5 py-1.5 text-left text-base focus-visible:outline-none sm:gap-6",
                        selectedId === item.id && "font-bold text-primary"
                      )}
                    >
                      <span>{item.label}</span>
                      {selectedId === item.id ? (
                        <CheckIcon aria-hidden="true" />
                      ) : (
                        item.suffix
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { FluidHoverHighlight } from "@/components/fluid-hover-highlight";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFluidHover } from "@/hooks/use-fluid-hover";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { spring } from "@/lib/springs";

export type OutlineItem = {
  id: string;
  label: string;
  depth: 2 | 3;
};

export function OutlineDropdown({
  items,
  activeId,
  progress,
  label,
  onNavigate,
  children,
}: {
  items: OutlineItem[];
  activeId: string;
  progress: number;
  label: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
}) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const focusFrame = useRef<number | null>(null);
  const hover = useFluidHover(listRef, { axis: "y", nearest: true });
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefCallbacks = useMemo(
    () =>
      items.map((_, index) => (element: HTMLAnchorElement | null) => {
        itemRefs.current[index] = element;
        hover.registerItem(index, element);
      }),
    [items, hover.registerItem]
  );

  const close = useCallback(
    (restoreFocus = false) => {
      clearTimeout(openTimer.current);
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
      focusFrame.current = null;
      openRef.current = false;
      setOpen(false);
      hover.setActiveIndex(null);
      if (restoreFocus) triggerRef.current?.focus();
    },
    [hover.setActiveIndex]
  );

  const openMenu = () => {
    openRef.current = true;
    setOpen(true);
  };

  const scheduleFocus = (index: number) => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      itemRefs.current[index]?.focus();
    });
  };

  const centerActiveItem = useCallback(
    (element: HTMLSpanElement | null) => {
      if (!element || !open) return;
      const frame = requestAnimationFrame(() => {
        const viewport = menuRef.current?.querySelector<HTMLElement>(
          '[data-slot="scroll-area-viewport"]'
        );
        if (!viewport) return;
        const viewportRect = viewport.getBoundingClientRect();
        const activeRect = element.getBoundingClientRect();
        viewport.scrollTop +=
          activeRect.top -
          viewportRect.top -
          viewport.clientHeight / 2 +
          activeRect.height / 2;
      });
      return () => cancelAnimationFrame(frame);
    },
    [open]
  );

  useMountEffect(() => () => {
    clearTimeout(openTimer.current);
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
  });

  useMountEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (openRef.current && !rootRef.current?.contains(event.target as Node))
        close();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  });

  const move = (index: number) => {
    const next = (index + items.length) % items.length;
    setFocusedIndex(next);
    hover.setActiveIndex(next);
    openMenu();
    scheduleFocus(next);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      move(focusedIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(focusedIndex - 1);
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
      data-slot="button"
      className="relative size-10 rounded-lg border border-border bg-background dark:border-input dark:bg-neutral-800"
      onMouseEnter={() => {
        clearTimeout(openTimer.current);
        openTimer.current = setTimeout(openMenu, 200);
      }}
      onMouseLeave={() => close()}
      onBlurCapture={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null))
          close();
      }}
    >
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon-lg"
        className="size-full rounded-[inherit] text-primary"
        aria-label={`${Math.round(progress * 100)}% · ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => {
          clearTimeout(openTimer.current);
          const index = Math.max(
            0,
            items.findIndex((item) => item.id === activeId)
          );
          setFocusedIndex(index);
          openMenu();
          scheduleFocus(index);
        }}
        onKeyDown={onKeyDown}
      >
        {children}
      </Button>
      <AnimatePresence>
        {open && (
          <div className="absolute top-1/2 right-full z-50 w-96 max-w-[calc(100vw-4rem)] -translate-y-1/2 pr-2">
            <motion.div
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, x: 8 }
              }
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{
                opacity: 0,
                scale: 0.97,
                x: 6,
                transition: spring.moderate.exit,
              }}
              transition={spring.moderate}
              style={{ transformOrigin: "center right" }}
              className="rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <ScrollArea
                ref={menuRef}
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
                    <a
                      key={item.id}
                      ref={itemRefCallbacks[index]}
                      role="menuitem"
                      href={`#${encodeURIComponent(item.id)}`}
                      data-active={activeId === item.id || undefined}
                      onPointerMove={() => setFocusedIndex(index)}
                      onFocus={() => {
                        setFocusedIndex(index);
                        hover.setActiveIndex(index);
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        close(true);
                        onNavigate(item.id);
                      }}
                      className={`relative flex min-h-8 w-full min-w-0 items-center rounded-md px-2.5 py-1.5 text-left text-base focus-visible:outline-none ${
                        activeId === item.id ? "font-semibold text-primary" : ""
                      }`}
                    >
                      <span
                        ref={
                          activeId === item.id ? centerActiveItem : undefined
                        }
                        className={
                          item.depth === 3 ? "min-w-0 pl-4" : "min-w-0"
                        }
                      >
                        {item.label}
                      </span>
                    </a>
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

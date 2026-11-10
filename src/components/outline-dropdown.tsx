import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { FluidHoverHighlight } from "@/components/fluid-hover-highlight";
import { Button } from "@/components/ui/button";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hover = useFluidHover(listRef, { axis: "y", nearest: true });
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const focusAfterOpen = useRef(false);
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
      setOpen(false);
      hover.setActiveIndex(null);
      if (restoreFocus) triggerRef.current?.focus();
    },
    [hover.setActiveIndex]
  );

  useMountEffect(() => () => clearTimeout(openTimer.current));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, close]);

  useEffect(() => {
    if (!open || !focusAfterOpen.current) return;
    const frame = requestAnimationFrame(() => {
      itemRefs.current[focusedIndex]?.focus();
      focusAfterOpen.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [open, focusedIndex]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const viewport = menuRef.current;
      const active = viewport?.querySelector<HTMLElement>(
        `[href="#${encodeURIComponent(activeId)}"]`
      );
      if (!viewport || !active) return;
      const viewportRect = viewport.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      viewport.scrollTop +=
        activeRect.top -
        viewportRect.top -
        viewport.clientHeight / 2 +
        activeRect.height / 2;
    });
    return () => cancelAnimationFrame(frame);
  }, [open, activeId]);

  const move = (index: number) => {
    const next = (index + items.length) % items.length;
    setFocusedIndex(next);
    hover.setActiveIndex(next);
    focusAfterOpen.current = true;
    setOpen(true);
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
        openTimer.current = setTimeout(() => setOpen(true), 200);
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
          focusAfterOpen.current = true;
          setFocusedIndex(
            Math.max(
              0,
              items.findIndex((item) => item.id === activeId)
            )
          );
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
      >
        {children}
      </Button>
      <AnimatePresence>
        {open && (
          <div className="absolute top-1/2 right-full z-50 w-64 -translate-y-1/2 pr-2">
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
              <div
                ref={menuRef}
                className="max-h-[calc(50dvh-0.625rem)] overflow-y-auto overscroll-contain"
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
                      className={`relative flex min-h-8 w-full min-w-0 items-center rounded-md px-2.5 py-1.5 text-left text-sm focus-visible:outline-none ${
                        activeId === item.id ? "font-semibold text-primary" : ""
                      }`}
                    >
                      <span className={item.depth === 3 ? "pl-4" : undefined}>
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

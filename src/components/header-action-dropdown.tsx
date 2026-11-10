import { CheckIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId, useMemo, useRef, useState } from "react";
import { FluidHoverHighlight } from "@/components/fluid-hover-highlight";
import { Button } from "@/components/ui/button";
import { useFluidHover } from "@/hooks/use-fluid-hover";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { spring } from "@/lib/springs";

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
    setOpen(false);
    hover.setActiveIndex(null);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const openMenu = (focus = false) => {
    clearTimeout(timer.current);
    if (openRef.current) return;
    const index = Math.max(
      0,
      items.findIndex((item) => item.id === selectedId)
    );
    setFocusedIndex(index);
    openRef.current = true;
    setOpen(true);
    if (focus) {
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
    openMenu();
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
        timer.current = setTimeout(() => openMenu(), 200);
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
        size="icon"
        className={className}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (openRef.current ? close() : openMenu(true))}
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
                    className="relative flex min-h-9 w-full items-center justify-between gap-3 whitespace-nowrap rounded-md px-3 py-1.5 text-left text-base focus-visible:outline-none sm:gap-6"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

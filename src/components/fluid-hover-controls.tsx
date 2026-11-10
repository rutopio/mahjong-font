import { type ReactNode, useRef } from "react";
import { FluidHoverHighlight } from "@/components/fluid-hover-highlight";
import { ButtonGroup } from "@/components/ui/button-group";
import { useFluidHover } from "@/hooks/use-fluid-hover";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { cn } from "@/lib/utils";

export function FluidHoverControls({
  children,
  className,
  label,
  compact = false,
  orientation = "horizontal",
  buttonGroup = false,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  compact?: boolean;
  orientation?: "horizontal" | "vertical";
  buttonGroup?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(containerRef, {
    axis: orientation === "vertical" ? "y" : "x",
    nearest: true,
    gapClick: false,
  });

  const lastIndex = hover.itemRects.length - 1;
  const highlightRadius =
    !buttonGroup || lastIndex <= 0
      ? "rounded-lg"
      : orientation === "vertical"
        ? hover.activeIndex === 0
          ? "rounded-t-lg"
          : hover.activeIndex === lastIndex
            ? "rounded-b-lg"
            : "rounded-none"
        : hover.activeIndex === 0
          ? "rounded-l-lg"
          : hover.activeIndex === lastIndex
            ? "rounded-r-lg"
            : "rounded-none";

  useMountEffect(() => {
    const items = itemsRef.current;
    if (!items) return;
    let registered: HTMLElement[] = [];
    const sync = () => {
      const next = Array.from(items.children).filter(
        (element): element is HTMLElement => element instanceof HTMLElement
      );
      if (
        next.length === registered.length &&
        next.every((element, index) => element === registered[index])
      )
        return;

      registered.forEach((_, index) => {
        hover.registerItem(index, null);
      });
      next.forEach((element, index) => {
        hover.registerItem(index, element);
      });
      registered = next;
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(items, { childList: true });
    return () => {
      observer.disconnect();
      registered.forEach((_, index) => {
        hover.registerItem(index, null);
      });
    };
  });

  const handleFocus = (target: EventTarget) => {
    const items = itemsRef.current;
    if (
      !(target instanceof Node) ||
      !items ||
      (target instanceof Element && target.closest("[role=menu]"))
    )
      return;
    const index = Array.from(items.children).findIndex((element) =>
      element.contains(target)
    );
    if (index >= 0) hover.setActiveIndex(index);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: A fieldset adds default layout and form behavior to this hover container.
    <div
      role="group"
      aria-label={label}
      ref={containerRef}
      className={cn(
        "relative rounded-lg",
        buttonGroup && "bg-background dark:bg-neutral-800",
        className
      )}
      {...hover.handlers}
      onMouseMove={(event) => {
        if (
          !(
            event.target instanceof Element &&
            event.target.closest("[role=menu]")
          )
        )
          hover.handlers.onMouseMove(event);
      }}
      onFocusCapture={(event) => handleFocus(event.target)}
      onBlurCapture={(event) => {
        if (
          !containerRef.current?.contains(event.relatedTarget as Node | null)
        ) {
          hover.setActiveIndex(null);
        }
      }}
    >
      <FluidHoverHighlight
        hover={hover}
        className={cn("z-10", highlightRadius)}
      />
      {buttonGroup ? (
        <ButtonGroup
          ref={itemsRef}
          orientation={orientation}
          aria-label={label}
          className="relative z-20"
        >
          {children}
        </ButtonGroup>
      ) : (
        <div
          ref={itemsRef}
          className={cn(
            "relative z-20 flex items-center gap-2",
            compact && "gap-0 min-[360px]:gap-2"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

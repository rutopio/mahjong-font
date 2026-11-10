import { ArrowBendRightUpIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiShareButton } from "@/components/api-share-button";
import { FluidHoverControls } from "@/components/fluid-hover-controls";
import {
  OutlineDropdown,
  type OutlineItem,
} from "@/components/outline-dropdown";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMountEffect } from "@/hooks/use-mount-effect";

const circumference = 2 * Math.PI * 6.25;

function ReadingProgressRing({ progress }: { progress: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 -rotate-90">
      <circle
        cx="8"
        cy="8"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-20"
      />
      <motion.circle
        cx="8"
        cy="8"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={false}
        animate={{ strokeDashoffset: (1 - progress) * circumference }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 200, damping: 30, mass: 0.4 }
        }
      />
    </svg>
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ApiPageActions({
  items,
  pageTitle,
  actionsLabel,
}: {
  items: OutlineItem[];
  pageTitle?: string;
  actionsLabel?: string;
}) {
  const { t } = useTranslation();
  const label = actionsLabel ?? t("apiActions.label");
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const selectedId = activeId || items[0]?.id || "";
  const drawerScrollRef = useRef<HTMLElement>(null);

  useMountEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.body.style.position === "fixed") return;
      const scrollY = window.scrollY;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 1
      );
      const line = scrollY + Math.max(120, Math.round(window.innerHeight / 3));
      let current = "";
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (heading && heading.getBoundingClientRect().top + scrollY <= line)
          current = item.id;
      }
      if (scrollY >= scrollable - 2) current = items.at(-1)?.id ?? current;
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  });

  const centerActiveInDrawer = () => {
    requestAnimationFrame(() => {
      const viewport = drawerScrollRef.current;
      const active = viewport?.querySelector<HTMLElement>("[data-active]");
      if (!viewport || !active) return;
      const viewportRect = viewport.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      viewport.scrollTop +=
        activeRect.top -
        viewportRect.top -
        viewport.clientHeight / 2 +
        activeRect.height / 2;
    });
  };

  const handleOutlineOpenChange = (open: boolean) => {
    setOutlineOpen(open);
    if (open) centerActiveInDrawer();
  };

  const navigateToHeading = (id: string) => {
    setOutlineOpen(false);
    const reduceMotion = prefersReducedMotion();
    window.setTimeout(
      () => {
        const heading = document.getElementById(id);
        if (!heading) return;
        heading.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        history.replaceState(null, "", `#${encodeURIComponent(id)}`);
      },
      reduceMotion ? 0 : 350
    );
  };

  const utilities = (
    <>
      <ApiShareButton size="icon-lg" />
      <Button
        variant="outline"
        size="icon-lg"
        aria-label={t("apiActions.scrollToTop")}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? "auto" : "smooth",
          })
        }
      >
        <ArrowBendRightUpIcon className="size-4" aria-hidden="true" />
      </Button>
    </>
  );

  return (
    <>
      <FluidHoverControls
        buttonGroup
        orientation="horizontal"
        label={label}
        className="fixed right-4 bottom-[calc(2rem+env(safe-area-inset-bottom))] z-10 h-fit min-[50rem]:hidden"
      >
        {items.length > 0 && (
          <Drawer open={outlineOpen} onOpenChange={handleOutlineOpenChange}>
            <DrawerTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-lg"
                  aria-label={`${Math.round(progress * 100)}% · ${t("apiActions.outline")}`}
                />
              }
            >
              <ReadingProgressRing progress={progress} />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="border-border border-b pb-4">
                <DrawerTitle>{pageTitle ?? t("imgApi.title")}</DrawerTitle>
              </DrawerHeader>
              <nav
                ref={drawerScrollRef}
                aria-label={t("apiActions.outline")}
                className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-6"
              >
                <ul className="flex flex-col gap-1">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className={item.depth === 3 ? "mx-6" : undefined}
                    >
                      <a
                        href={`#${encodeURIComponent(item.id)}`}
                        data-active={selectedId === item.id || undefined}
                        aria-current={
                          selectedId === item.id ? "location" : undefined
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          navigateToHeading(item.id);
                        }}
                        className="flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=location]:bg-muted"
                      >
                        <span className="min-w-0">{item.label}</span>
                        <ArrowLeftIcon
                          className={`size-4 shrink-0 ${selectedId === item.id ? "" : "invisible"}`}
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </DrawerContent>
          </Drawer>
        )}
        {utilities}
      </FluidHoverControls>

      <FluidHoverControls
        buttonGroup
        orientation="vertical"
        label={label}
        className="fixed top-1/2 left-[var(--gutter-offset)] z-10 hidden h-fit -translate-y-1/2 min-[50rem]:flex"
      >
        {items.length > 0 && (
          <OutlineDropdown
            items={items}
            activeId={selectedId}
            progress={progress}
            label={t("apiActions.outline")}
            onNavigate={navigateToHeading}
          >
            <ReadingProgressRing progress={progress} />
          </OutlineDropdown>
        )}
        {utilities}
      </FluidHoverControls>
    </>
  );
}

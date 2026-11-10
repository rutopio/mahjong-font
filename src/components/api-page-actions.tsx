import { ArrowBendRightUpIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { ActionMenu } from "@rutopio/base-component/action-menu";
import {
  OutlineList,
  type OutlineListItem,
} from "@rutopio/base-component/outline-list";
import { PageActionRail } from "@rutopio/base-component/page-action-rail";
import { navigateToSection } from "@rutopio/base-component/section-navigation";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiShareButton } from "@/components/api-share-button";
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
  items: OutlineListItem[];
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
    navigateToSection(id, () => setOutlineOpen(false));
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
    <PageActionRail
      label={label}
      mobileOutline={
        <>
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
                  <OutlineList
                    items={items}
                    activeId={selectedId}
                    onNavigate={navigateToHeading}
                    indicator={<ArrowLeftIcon className="size-4" />}
                  />
                </nav>
              </DrawerContent>
            </Drawer>
          )}
        </>
      }
      desktopOutline={
        <>
          {items.length > 0 && (
            <ActionMenu
              label={t("apiActions.outline")}
              triggerLabel={`${Math.round(progress * 100)}% · ${t("apiActions.outline")}`}
              trigger={<ReadingProgressRing progress={progress} />}
              side="left"
              indicator={<ArrowLeftIcon className="size-4" />}
              items={items.map((item) => ({
                ...item,
                active: item.id === selectedId,
                ariaCurrent:
                  item.id === selectedId ? ("location" as const) : undefined,
                href: `#${encodeURIComponent(item.id)}`,
                onSelect: (event) => {
                  event.preventDefault();
                  navigateToHeading(item.id);
                },
              }))}
            />
          )}
        </>
      }
      actions={utilities}
    />
  );
}

import { ArrowBendRightUpIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const headings = [
  { id: "url-format", label: "imgApi.urlFormatHeading" },
  { id: "convert-shared-url", label: "imgApi.convertHeading" },
  { id: "parameters", label: "imgApi.paramsHeading" },
  { id: "examples", label: "imgApi.examplesHeading" },
  { id: "embedding", label: "imgApi.embedHeading" },
] as const;

const circumference = 2 * Math.PI * 6.25;

function ProgressRing({ progress }: { progress: number }) {
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
      <circle
        cx="8"
        cy="8"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={(1 - progress) * circumference}
        className="transition-[stroke-dashoffset] duration-200 motion-reduce:transition-none"
      />
    </svg>
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ApiPageActions() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);
  const [outlineOpen, setOutlineOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 1
      );
      const line = scrollY + Math.max(120, Math.round(window.innerHeight / 3));
      let current = "";
      for (const item of headings) {
        const heading = document.getElementById(item.id);
        if (heading && heading.getBoundingClientRect().top + scrollY <= line)
          current = item.id;
      }
      if (scrollY >= scrollable - 2) current = headings.at(-1)?.id ?? current;
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
  }, []);

  const navigateToHeading = (id: string, fromDrawer = false) => {
    setOutlineOpen(false);
    window.setTimeout(
      () => {
        const heading = document.getElementById(id);
        if (!heading) return;
        heading.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
        history.replaceState(null, "", `#${encodeURIComponent(id)}`);
      },
      fromDrawer && !prefersReducedMotion() ? 350 : 0
    );
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("share.linkCopied"));
    } catch {
      toast.error(t("imgApi.copyFailed"));
    }
  };

  const utilities = (
    <>
      <Button
        variant="outline"
        size="icon-lg"
        aria-label={t("share.share")}
        onClick={share}
      >
        <ShareNetworkIcon aria-hidden="true" />
      </Button>
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
        <ArrowBendRightUpIcon aria-hidden="true" />
      </Button>
    </>
  );

  const outlineLabel = `${Math.round(progress * 100)}% · ${t("apiActions.outline")}`;

  return (
    <>
      <fieldset
        aria-label={t("apiActions.label")}
        className="fixed right-4 bottom-[calc(2rem+env(safe-area-inset-bottom))] z-10 flex h-fit gap-1 rounded-lg border bg-background p-1 shadow-xs min-[50rem]:hidden"
      >
        <Drawer open={outlineOpen} onOpenChange={setOutlineOpen}>
          <DrawerTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                aria-label={outlineLabel}
              />
            }
          >
            <ProgressRing progress={progress} />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="border-b pb-4">
              <DrawerTitle>{t("imgApi.title")}</DrawerTitle>
            </DrawerHeader>
            <nav
              aria-label={t("apiActions.outline")}
              className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-6"
            >
              <ul className="flex flex-col">
                {headings.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={
                        activeId === item.id ? "location" : undefined
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        navigateToHeading(item.id, true);
                      }}
                      className={`block py-1 text-base ${activeId === item.id ? "font-semibold text-primary" : "text-foreground"}`}
                    >
                      {t(item.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </DrawerContent>
        </Drawer>
        {utilities}
      </fieldset>

      <fieldset
        aria-label={t("apiActions.label")}
        className="fixed top-1/2 left-[var(--gutter-offset)] z-10 hidden h-fit -translate-y-1/2 flex-col gap-1 rounded-lg border bg-background p-1 shadow-xs min-[50rem]:flex"
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                aria-label={outlineLabel}
              />
            }
          >
            <ProgressRing progress={progress} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" align="center" className="w-56">
            {headings.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => navigateToHeading(item.id)}
                className={
                  activeId === item.id
                    ? "font-semibold text-primary"
                    : undefined
                }
              >
                {t(item.label)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {utilities}
      </fieldset>
    </>
  );
}

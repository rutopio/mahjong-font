import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TRANSITION_STYLE_ID = "theme-transition-style";
const REVEAL_FEATHER_RATIO = 0.12;
const REVEAL_DURATION_MS = 650;
const ICON_ENTER_DURATION = 0.08;
const ICON_EXIT_DURATION = 0.06;

function installTransitionStyle(
  x: number,
  y: number,
  radius: number,
  duration: number
) {
  document.getElementById(TRANSITION_STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = TRANSITION_STYLE_ID;
  style.textContent = `
    ::view-transition-new(root) {
      mask-image: radial-gradient(
        circle at ${x}px ${y}px,
        black calc(var(--theme-reveal-radius) * ${1 - REVEAL_FEATHER_RATIO}),
        transparent var(--theme-reveal-radius)
      );
      mask-repeat: no-repeat;
      animation: theme-mask-reveal ${duration}ms ease-out both;
    }

    @keyframes theme-mask-reveal {
      from { --theme-reveal-radius: 0px; }
      to { --theme-reveal-radius: ${radius / (1 - REVEAL_FEATHER_RATIO) + 2}px; }
    }
  `;
  document.head.appendChild(style);
  return style;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export function ThemeToggle({
  className,
  duration = REVEAL_DURATION_MS,
  ...props
}: ThemeToggleProps) {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const runningRef = useRef(false);
  const isDark = resolvedTheme === "dark";

  const toggle = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;
      const nextTheme = isDark ? "light" : "dark";
      const applyTheme = () => setTheme(nextTheme);

      if (
        typeof document.startViewTransition !== "function" ||
        prefersReducedMotion()
      ) {
        applyTheme();
        return;
      }
      if (runningRef.current) return;

      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const rect = button.getBoundingClientRect();
      const fromPointer = event.clientX !== 0 || event.clientY !== 0;
      const x = Math.min(
        Math.max(fromPointer ? event.clientX : rect.left + rect.width / 2, 0),
        viewportWidth
      );
      const y = Math.min(
        Math.max(fromPointer ? event.clientY : rect.top + rect.height / 2, 0),
        viewportHeight
      );
      const radius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y)
      );

      runningRef.current = true;
      const root = document.documentElement;
      root.classList.add("theme-transitioning");
      const style = installTransitionStyle(x, y, radius, duration);

      try {
        const transition = document.startViewTransition(() => {
          root.classList.toggle("dark", nextTheme === "dark");
          applyTheme();
        });
        await transition.ready;
        await transition.finished;
      } catch {
        // Theme is already applied if the view transition is interrupted.
      } finally {
        style.remove();
        root.classList.remove("theme-transitioning");
        runningRef.current = false;
      }
    },
    [duration, isDark, setTheme]
  );

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={cn(className)}
      {...props}
    >
      <div className="relative size-4">
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.6,
            filter: isDark ? "blur(0px)" : "blur(4px)",
          }}
          transition={{
            duration: isDark ? ICON_ENTER_DURATION : ICON_EXIT_DURATION,
            ease: isDark ? "easeOut" : "easeIn",
          }}
        >
          <SunIcon className="size-4" aria-hidden="true" />
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.6 : 1,
            filter: isDark ? "blur(4px)" : "blur(0px)",
          }}
          transition={{
            duration: isDark ? ICON_EXIT_DURATION : ICON_ENTER_DURATION,
            ease: isDark ? "easeIn" : "easeOut",
          }}
        >
          <MoonIcon className="size-4" aria-hidden="true" />
        </motion.span>
      </div>
      <span className="sr-only">
        {isDark ? t("ui.switchToLight") : t("ui.switchToDark")}
      </span>
    </Button>
  );
}

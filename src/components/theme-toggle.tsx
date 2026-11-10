import { ThemeToggle as BaseThemeToggle } from "@rutopio/base-component/theme-toggle";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

export function ThemeToggle(props: ComponentProps<typeof BaseThemeToggle>) {
  const { t } = useTranslation();
  return (
    <BaseThemeToggle
      toLightLabel={t("ui.switchToLight")}
      toDarkLabel={t("ui.switchToDark")}
      {...props}
    />
  );
}

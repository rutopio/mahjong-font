import { InfoIcon } from "@phosphor-icons/react";
import { Button } from "@rutopio/ui/button";
import { useTranslation } from "react-i18next";

interface NotationsButtonProps {
  onClick: () => void;
}

export function NotationsButton({ onClick }: NotationsButtonProps) {
  const { t } = useTranslation();
  return (
    <Button onClick={onClick} className="">
      <InfoIcon aria-hidden="true" />
      {t("ui.howToUse")}
    </Button>
  );
}

import { Button } from "@rutopio/ui/button";
import { useTranslation } from "react-i18next";

export function RootError() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-bold text-balance">
        {t("ui.errorOccurred")}
      </h1>
      <Button onClick={() => window.location.reload()}>
        {t("ui.tryAgain")}
      </Button>
    </div>
  );
}

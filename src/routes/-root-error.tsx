import { Button } from "@rutopio/base-component/button";
import { useTranslation } from "react-i18next";

export function RootError() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-balance font-bold text-xl">
        {t("ui.errorOccurred")}
      </h1>
      <Button onClick={() => window.location.reload()}>
        {t("ui.tryAgain")}
      </Button>
    </div>
  );
}

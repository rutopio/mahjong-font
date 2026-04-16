import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export function RootError({ error }: { error: unknown }) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-bold text-balance">{t("errorOccurred")}</h1>
      <Button onClick={() => window.location.reload()}>{t("tryAgain")}</Button>
    </div>
  );
}

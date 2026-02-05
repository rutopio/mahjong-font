"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <h2 className="text-xl font-bold">{t("errorOccurred")}</h2>
      <Button onClick={() => reset()}>{t("tryAgain")}</Button>
    </div>
  );
}

"use client";

import { I18nextProvider } from "react-i18next";

import i18n from "@/app/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

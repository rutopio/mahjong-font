import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "@/locale/en.json";
import translationJA from "@/locale/ja.json";
import translationZHCN from "@/locale/zh-CN.json";
import translationZHTW from "@/locale/zh-TW.json";

const resources = {
  en: { translation: translationEN },
  "zh-TW": { translation: translationZHTW },
  "zh-CN": { translation: translationZHCN },
  ja: { translation: translationJA },
};

// The URL is the source of truth for language (see lib/locale.ts and the
// LangSync effect in __root). i18next initializes to the default (ja); LangSync
// calls changeLanguage on every navigation to match the path. No localStorage.
i18next.use(initReactI18next).init({
  resources,
  lng: "ja",
  fallbackLng: "ja",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18next;

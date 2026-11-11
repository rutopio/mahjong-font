import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "@/locales/en.json";
import translationJA from "@/locales/ja.json";
import translationZHCN from "@/locales/zh-CN.json";
import translationZHTW from "@/locales/zh-TW.json";

const resources = {
  en: { translation: translationEN },
  "zh-TW": { translation: translationZHTW },
  "zh-CN": { translation: translationZHCN },
  ja: { translation: translationJA },
};

// Route entry controls language; browser detection would disagree with shared URLs.
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

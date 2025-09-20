import { initReactI18next } from "react-i18next";
import i18next from "i18next";

// 導入翻譯檔案
import translationEN from "../locale/en.json";
import translationJA from "../locale/ja.json";
import translationZHCN from "../locale/zh-CN.json";
import translationZHTW from "../locale/zh-TW.json";

const resources = {
  en: { translation: translationEN },
  "zh-TW": { translation: translationZHTW },
  "zh-CN": { translation: translationZHCN },
  ja: { translation: translationJA },
};

// 獲取預設語言
const getDefaultLanguage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("preferred-language") || "ja";
  }
  return "ja";
};

i18next.use(initReactI18next).init({
  resources,
  lng: getDefaultLanguage(),
  fallbackLng: "ja",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // 禁用 Suspense 以避免 SSR 問題
  },
});

// 監聽語言變更
if (typeof window !== "undefined") {
  i18next.on("languageChanged", (lng: string) => {
    localStorage.setItem("preferred-language", lng);
  });
}

export default i18next;

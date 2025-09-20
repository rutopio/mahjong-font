"use client";

import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState("ja");
  const [useTranslation, setUseTranslation] = useState<any>(null);
  const [i18n, setI18n] = useState<any>(null);

  const languages = [
    { code: "ja", name: "日本語" },
    { code: "zh-TW", name: "繁體中文" },
    { code: "zh-CN", name: "简体中文" },
    { code: "en", name: "English" },
  ];

  useEffect(() => {
    const initTranslation = async () => {
      try {
        const { useTranslation: useT } = await import("react-i18next");
        setUseTranslation(() => useT);
      } catch (error) {
        console.error("Failed to load react-i18next:", error);
      }
    };

    initTranslation();
  }, []);

  useEffect(() => {
    if (useTranslation) {
      try {
        const { i18n: i18nInstance } = useTranslation();
        setI18n(i18nInstance);
        setCurrentLanguage(i18nInstance.language || "ja");
      } catch (error) {
        console.error("Failed to get i18n instance:", error);
      }
    }
  }, [useTranslation]);

  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value);
    if (i18n) {
      i18n.changeLanguage(value);
    } else {
      // 如果 i18n 未初始化，至少保存到 localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("preferred-language", value);
      }
    }
  };

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

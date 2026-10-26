"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Direction, Language, TranslationDictionary } from "./types";
import { translations } from "./translations";

const STORAGE_LANG_KEY = "simple_todo_lang";

export interface LanguageContextValue {
  language: Language;
  direction: Direction;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
  formatDate: (isoString: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load language from localStorage once mounted on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as Language | null;
      if (saved === "ar" || saved === "en") {
        setLanguageState(saved);
      }
    } catch {
      // localStorage unavailable or restricted
    }
  }, []);

  // Update HTML tag dir and lang attributes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "ar" : "en");
  }, [language, setLanguage]);

  const direction: Direction = language === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";
  const t = translations[language];

  const formatDate = useCallback(
    (isoString: string): string => {
      try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
          return language === "ar" ? "تاريخ غير معروف" : "Unknown date";
        }

        const locale = language === "ar" ? "ar-SA" : "en-US";
        return new Intl.DateTimeFormat(locale, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(date);
      } catch {
        return language === "ar" ? "تاريخ غير معروف" : "Unknown date";
      }
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      direction,
      isRTL,
      setLanguage,
      toggleLanguage,
      t,
      formatDate,
    }),
    [language, direction, isRTL, setLanguage, toggleLanguage, t, formatDate]
  );

  return (
    <LanguageContext.Provider value={value}>
      <div dir={direction} className={isRTL ? "font-arabic" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for tests or components rendered outside provider
    const defaultLang: Language = "en";
    return {
      language: defaultLang,
      direction: "ltr",
      isRTL: false,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: translations[defaultLang],
      formatDate: (isoString: string) => {
        try {
          const date = new Date(isoString);
          return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }).format(date);
        } catch {
          return "Unknown date";
        }
      },
    };
  }
  return context;
}

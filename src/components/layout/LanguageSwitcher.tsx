"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-800/80 p-0.5 text-xs font-medium"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
          language === "en"
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("ar")}
        aria-pressed={language === "ar"}
        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
          language === "ar"
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
      >
        عربي
      </button>
    </div>
  );
}

"use client";

import React from "react";
import { appConfig } from "@/lib/config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 mt-auto py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">
              {t.footer.title}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {t.footer.subtitle}
            </p>
          </div>

          <div
            dir="ltr"
            className="flex items-center gap-4 text-xs font-mono bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800"
          >
            <span>GET /tasks</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span>POST /tasks</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span>PATCH /tasks/:id</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span>DELETE /tasks/:id</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
          <span>
            {t.mode.currentMode}:{" "}
            <strong className="text-zinc-700 dark:text-zinc-300">
              {appConfig.isMock ? t.mode.mockAdapterDesc : t.mode.liveApi}
            </strong>
          </span>
          <span className="text-zinc-400">{t.mode.switchModeHint}</span>
        </div>
      </div>
    </footer>
  );
}

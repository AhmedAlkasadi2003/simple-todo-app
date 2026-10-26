"use client";

import React from "react";
import { appConfig } from "@/lib/config";
import { Badge } from "../ui/Badge";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ModeIndicator() {
  const { isMock, apiUrl } = appConfig;
  const { t } = useLanguage();

  return (
    <div className="inline-flex items-center gap-2">
      {isMock ? (
        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-full px-3 py-1 text-xs">
          <Badge variant="mock">{t.mode.mockMode}</Badge>
          <span className="text-purple-700 dark:text-purple-300 font-medium hidden sm:inline">
            {t.mode.localStorageDesc}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-full px-3 py-1 text-xs">
          <Badge variant="api">{t.mode.liveApi}</Badge>
          <span className="text-sky-700 dark:text-sky-300 font-medium hidden sm:inline font-mono text-[11px]">
            {apiUrl}
          </span>
        </div>
      )}
    </div>
  );
}

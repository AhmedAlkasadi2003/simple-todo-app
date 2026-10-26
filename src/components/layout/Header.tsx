"use client";

import React from "react";
import Link from "next/link";
import { ModeIndicator } from "./ModeIndicator";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "../ui/Button";
import { PlusIcon } from "../ui/Icons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface HeaderProps {
  onCreateClick?: () => void;
}

export function Header({ onCreateClick }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
              ST
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 block leading-tight">
                {t.app.title}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block leading-none">
                {t.app.subtitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Right Actions: Mode Indicator + Language Switcher + New Task Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <ModeIndicator />
          {onCreateClick && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusIcon className="w-4 h-4" />}
              onClick={onCreateClick}
            >
              {t.app.newTask}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

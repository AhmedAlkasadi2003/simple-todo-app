"use client";

import React from "react";
import { TaskFilterStatus, TaskSummaryStats } from "@/features/tasks/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface TaskStatsProps {
  stats: TaskSummaryStats;
  currentFilter: TaskFilterStatus;
  onFilterChange: (filter: TaskFilterStatus) => void;
}

export function TaskStats({
  stats,
  currentFilter,
  onFilterChange,
}: TaskStatsProps) {
  const { t } = useLanguage();
  const { total, completed, pending } = stats;
  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Tasks Card */}
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`flex flex-col p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
            currentFilter === "all"
              ? "bg-blue-50/70 border-blue-300 dark:bg-blue-950/40 dark:border-blue-800 ring-2 ring-blue-500/20"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {t.stats.totalTasks}
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {total}
            </span>
            <span className="text-xs text-zinc-400">{t.stats.allCreated}</span>
          </div>
        </button>

        {/* Pending Tasks Card */}
        <button
          type="button"
          onClick={() => onFilterChange("pending")}
          className={`flex flex-col p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
            currentFilter === "pending"
              ? "bg-amber-50/70 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 ring-2 ring-amber-500/20"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {t.stats.pending}
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {pending}
            </span>
            <span className="text-xs text-amber-600/70 dark:text-amber-400/70">
              {t.stats.needsAction}
            </span>
          </div>
        </button>

        {/* Completed Tasks Card */}
        <button
          type="button"
          onClick={() => onFilterChange("completed")}
          className={`flex flex-col p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
            currentFilter === "completed"
              ? "bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 ring-2 ring-emerald-500/20"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {t.stats.completed}
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {completed}
            </span>
            <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
              {completionPercentage}
              {t.stats.percentDone}
            </span>
          </div>
        </button>
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${completionPercentage}%` }}
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t.stats.progressAriaLabel}
          />
        </div>
      )}
    </div>
  );
}

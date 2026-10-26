"use client";

import React from "react";
import {
  TaskFilterStatus,
  TaskSortOption,
  TaskSummaryStats,
} from "@/features/tasks/types";
import { Input } from "../ui/Input";
import { CloseIcon, SearchIcon } from "../ui/Icons";
import { Select } from "../ui/Select";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface TaskControlsProps {
  searchQuery: string;
  statusFilter: TaskFilterStatus;
  sortBy: TaskSortOption;
  stats: TaskSummaryStats;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: TaskFilterStatus) => void;
  onSortChange: (sort: TaskSortOption) => void;
}

export function TaskControls({
  searchQuery,
  statusFilter,
  sortBy,
  stats,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
}: TaskControlsProps) {
  const { t } = useLanguage();

  const sortOptions = [
    { value: "createdAt-desc", label: t.controls.sortNewest },
    { value: "createdAt-asc", label: t.controls.sortOldest },
    { value: "title-asc", label: t.controls.sortTitleAZ },
    { value: "title-desc", label: t.controls.sortTitleZA },
  ];

  const filterButtons: {
    status: TaskFilterStatus;
    label: string;
    count: number;
    ariaLabel: string;
  }[] = [
    {
      status: "all",
      label: t.controls.all,
      count: stats.total,
      ariaLabel: `${t.controls.filterByAll} (${stats.total})`,
    },
    {
      status: "pending",
      label: t.stats.pending,
      count: stats.pending,
      ariaLabel: `${t.controls.filterByPending} (${stats.pending})`,
    },
    {
      status: "completed",
      label: t.stats.completed,
      count: stats.completed,
      ariaLabel: `${t.controls.filterByCompleted} (${stats.completed})`,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs">
      {/* Search Input Row */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full flex-1">
          <Input
            placeholder={t.controls.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<SearchIcon className="w-4 h-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label={t.controls.clearSearch}
                  className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-auto shrink-0">
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as TaskSortOption)}
            options={sortOptions}
            aria-label={t.controls.sortByAria}
          />
        </div>
      </div>

      {/* Filter Tabs / Pills */}
      <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/80 overflow-x-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 shrink-0 mx-1">
          {t.controls.statusLabel}
        </span>
        {filterButtons.map((btn) => {
          const isActive = statusFilter === btn.status;
          return (
            <button
              key={btn.status}
              type="button"
              aria-label={btn.ariaLabel}
              onClick={() => onStatusFilterChange(btn.status)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <span>{btn.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-zinc-700 dark:bg-zinc-300 text-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {btn.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

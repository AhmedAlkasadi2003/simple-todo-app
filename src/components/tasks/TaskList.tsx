"use client";

import React from "react";
import { Task } from "@/features/tasks/types";
import { TaskCard } from "./TaskCard";
import { Button } from "../ui/Button";
import { PlusIcon, SearchIcon } from "../ui/Icons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface TaskListProps {
  tasks: Task[];
  totalCount: number;
  isLoading: boolean;
  isSubmitting?: boolean;
  searchQuery: string;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreateNew: () => void;
  onClearFilters: () => void;
}

export function TaskList({
  tasks,
  totalCount,
  isLoading,
  isSubmitting = false,
  searchQuery,
  onToggleStatus,
  onEdit,
  onDelete,
  onCreateNew,
  onClearFilters,
}: TaskListProps) {
  const { t } = useLanguage();

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div
        className="w-full flex flex-col gap-3"
        aria-busy="true"
        aria-label={t.list.loadingAria}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full h-28 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800/60 rounded mt-2" />
            <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800/40 rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  // Empty State: No tasks created at all
  if (totalCount === 0) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-10 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
          <PlusIcon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {t.list.noTasksYet}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
          {t.list.noTasksYetDesc}
        </p>
        <Button
          variant="primary"
          leftIcon={<PlusIcon className="w-4 h-4" />}
          onClick={onCreateNew}
        >
          {t.list.createFirstTask}
        </Button>
      </div>
    );
  }

  // Empty State: Filters/Search returned zero results
  if (tasks.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10 text-center flex flex-col items-center justify-center shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-3">
          <SearchIcon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {t.list.noMatchingTasks}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
          {searchQuery
            ? t.list.noMatchingSearch.replace("{query}", searchQuery)
            : t.list.noMatchingStatus}
        </p>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          {t.list.resetFilters}
        </Button>
      </div>
    );
  }

  // Active Task List
  return (
    <div
      className="w-full flex flex-col gap-3"
      role="feed"
      aria-label={t.list.feedAria}
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isSubmitting={isSubmitting}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

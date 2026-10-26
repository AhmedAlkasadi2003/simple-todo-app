"use client";

import React from "react";
import Link from "next/link";
import { Task } from "@/features/tasks/types";
import { Badge } from "../ui/Badge";
import { CalendarIcon, CheckIcon, EditIcon, TrashIcon } from "../ui/Icons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface TaskCardProps {
  task: Task;
  isSubmitting?: boolean;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({
  task,
  isSubmitting = false,
  onToggleStatus,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const { t, formatDate } = useLanguage();
  const isCompleted = task.status === "completed";

  return (
    <article
      className={`group rounded-xl border p-4 sm:p-5 transition-all bg-white dark:bg-zinc-900 ${
        isCompleted
          ? "border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 opacity-90"
          : "border-zinc-200 dark:border-zinc-800 shadow-2xs hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Completion Toggle Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          aria-label={`${t.card.markAs} "${task.title}" ${
            isCompleted ? t.card.markPending : t.card.markCompleted
          }`}
          disabled={isSubmitting}
          onClick={() => onToggleStatus(task.id)}
          className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 mt-0.5 ${
            isCompleted
              ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
              : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:border-emerald-500 text-transparent"
          }`}
        >
          <CheckIcon
            className={`w-3.5 h-3.5 ${
              isCompleted ? "opacity-100" : "opacity-0 group-hover:opacity-30"
            }`}
          />
        </button>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={`/tasks/${encodeURIComponent(task.id)}`}
              className={`font-semibold text-base transition-colors hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:underline ${
                isCompleted
                  ? "line-through text-zinc-400 dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-50"
              }`}
            >
              {task.title}
            </Link>
            <Badge status={task.status} />
          </div>

          {task.description && (
            <p
              className={`text-sm mt-1 leading-relaxed line-clamp-3 ${
                isCompleted
                  ? "text-zinc-400 dark:text-zinc-500"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Timestamps & ID */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>
                {t.card.createdAt} {formatDate(task.createdAt)}
              </span>
            </span>

            {task.updatedAt !== task.createdAt && (
              <span className="hidden sm:inline">
                {t.card.updatedAt} {formatDate(task.updatedAt)}
              </span>
            )}

            <span className="font-mono text-[11px] opacity-60">
              {t.card.idLabel} {task.id}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
          {/* Edit Button */}
          <button
            type="button"
            aria-label={`${t.card.editTask} "${task.title}"`}
            disabled={isSubmitting}
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <EditIcon className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            aria-label={`${t.card.deleteTask} "${task.title}"`}
            disabled={isSubmitting}
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

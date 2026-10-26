"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Task } from "@/features/tasks/types";
import { formatDate } from "@/features/tasks/utils";
import { useTask } from "@/features/tasks/hooks";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  EditIcon,
  TrashIcon,
} from "../ui/Icons";
import { TaskFormModal } from "../forms/TaskFormModal";
import { DeleteConfirmDialog } from "../forms/DeleteConfirmDialog";
import { taskService } from "@/lib/api";

export interface TaskDetailsProps {
  initialTask?: Task;
  taskId: string;
}

export function TaskDetails({ taskId }: TaskDetailsProps) {
  const router = useRouter();
  const { task, isLoading, isSubmitting, error, reload, update, toggleStatus } =
    useTask(taskId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleEditSubmit = async (input: {
    title?: string;
    description?: string | null;
  }) => {
    setActionError(null);
    const updated = await update(input);
    return Boolean(updated);
  };

  const handleDeleteConfirm = async () => {
    if (!task) return;
    setIsDeleting(true);
    setActionError(null);

    try {
      await taskService.deleteTask(task.id);
      setIsDeleteDialogOpen(false);
      router.push("/");
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete task."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 flex flex-col gap-4">
          <div className="h-8 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-20 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded mt-4" />
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to all tasks
        </Link>
        <Alert
          type="error"
          title="Task not found or failed to load"
          message={error?.message || `Could not find task with ID "${taskId}".`}
          onRetry={reload}
        />
      </div>
    );
  }

  const isCompleted = task.status === "completed";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:underline"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to task list
        </Link>
      </div>

      {actionError && (
        <div className="mb-4">
          <Alert
            type="error"
            message={actionError}
            onDismiss={() => setActionError(null)}
          />
        </div>
      )}

      {/* Main Task Detail Card */}
      <article className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs">
        {/* Header: Title + Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <Badge status={task.status} />
              <span className="font-mono text-xs text-zinc-400">
                ID: {task.id}
              </span>
            </div>
            <h1
              className={`text-2xl font-bold tracking-tight ${
                isCompleted
                  ? "line-through text-zinc-400 dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-50"
              }`}
            >
              {task.title}
            </h1>
          </div>

          {/* Quick Status Toggle */}
          <Button
            variant={isCompleted ? "secondary" : "primary"}
            size="sm"
            onClick={toggleStatus}
            isLoading={isSubmitting}
            leftIcon={<CheckIcon className="w-4 h-4" />}
          >
            {isCompleted ? "Mark Pending" : "Mark Complete"}
          </Button>
        </div>

        {/* Description */}
        <div className="py-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Description
          </h2>
          {task.description ? (
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          ) : (
            <p className="text-sm italic text-zinc-400">
              No description provided for this task.
            </p>
          )}
        </div>

        {/* Timestamps */}
        <div className="py-6 border-b border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-zinc-400" />
            <div>
              <span className="block font-medium text-zinc-700 dark:text-zinc-300">
                Created At
              </span>
              <span>{formatDate(task.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-zinc-400" />
            <div>
              <span className="block font-medium text-zinc-700 dark:text-zinc-300">
                Last Updated
              </span>
              <span>{formatDate(task.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<EditIcon className="w-4 h-4" />}
            onClick={() => setIsEditModalOpen(true)}
            disabled={isSubmitting}
          >
            Edit Task
          </Button>

          <Button
            variant="danger"
            size="sm"
            leftIcon={<TrashIcon className="w-4 h-4" />}
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isSubmitting}
          >
            Delete Task
          </Button>
        </div>
      </article>

      {/* Edit Form Modal */}
      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        taskToEdit={task}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        task={task}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isDeleting}
      />
    </div>
  );
}

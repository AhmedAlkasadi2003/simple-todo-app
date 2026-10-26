"use client";

import React from "react";
import { Task } from "@/features/tasks/types";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { TrashIcon } from "../ui/Icons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  task,
  onClose,
  onConfirm,
  isSubmitting = false,
}: DeleteConfirmDialogProps) {
  const { t } = useLanguage();
  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.deleteDialog.title}
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <TrashIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {t.deleteDialog.confirmQuestion}
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1 line-clamp-2">
              &ldquo;{task.title}&rdquo;
            </p>
            <p className="text-xs text-zinc-400 mt-2">
              {t.deleteDialog.warningDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t.deleteDialog.cancel}
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isSubmitting}
            onClick={onConfirm}
          >
            {t.deleteDialog.deleteButton}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

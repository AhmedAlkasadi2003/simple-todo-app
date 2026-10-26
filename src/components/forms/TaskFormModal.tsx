"use client";

import React, { useState } from "react";
import { CreateTaskInput, Task, UpdateTaskInput } from "@/features/tasks/types";
import { TASK_LIMITS } from "@/features/tasks/validation";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  onSubmit: (input: CreateTaskInput | UpdateTaskInput) => Promise<boolean>;
  isSubmitting?: boolean;
}

interface FormFieldsProps {
  taskToEdit?: Task | null;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput | UpdateTaskInput) => Promise<boolean>;
  isSubmitting: boolean;
}

function TaskFormFields({
  taskToEdit,
  onClose,
  onSubmit,
  isSubmitting,
}: FormFieldsProps) {
  const { t } = useLanguage();
  const isEditing = Boolean(taskToEdit);

  const [title, setTitle] = useState(taskToEdit?.title ?? "");
  const [description, setDescription] = useState(taskToEdit?.description ?? "");
  const [errors, setErrors] = useState<{ title?: string; description?: string }>(
    {}
  );
  const [touched, setTouched] = useState<{
    title?: boolean;
    description?: boolean;
  }>({});

  const validate = (tVal: string, dVal: string) => {
    const errs: { title?: string; description?: string } = {};
    const trimmedTitle = tVal.trim();

    if (!trimmedTitle) {
      errs.title = t.form.validationTitleRequired;
    } else if (trimmedTitle.length < TASK_LIMITS.TITLE_MIN_LENGTH) {
      errs.title = t.form.validationTitleMin;
    } else if (trimmedTitle.length > TASK_LIMITS.TITLE_MAX_LENGTH) {
      errs.title = t.form.validationTitleMax;
    }

    if (dVal && dVal.trim().length > TASK_LIMITS.DESCRIPTION_MAX_LENGTH) {
      errs.description = t.form.validationDescMax;
    }

    return errs;
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (touched.title) {
      const errs = validate(val, description);
      setErrors((prev) => ({ ...prev, title: errs.title }));
    }
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    if (touched.description) {
      const errs = validate(title, val);
      setErrors((prev) => ({ ...prev, description: errs.description }));
    }
  };

  const handleBlur = (field: "title" | "description") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(title, description);
    setErrors(errs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ title: true, description: true });
    const errs = validate(title, description);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload: CreateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Title Input */}
      <Input
        label={t.form.titleLabel}
        required
        placeholder={t.form.titlePlaceholder}
        value={title}
        maxLength={TASK_LIMITS.TITLE_MAX_LENGTH}
        onChange={(e) => handleTitleChange(e.target.value)}
        onBlur={() => handleBlur("title")}
        error={touched.title ? errors.title : undefined}
        hint={t.form.titleHint}
        autoFocus
      />

      {/* Description Textarea */}
      <Textarea
        label={t.form.descriptionLabel}
        placeholder={t.form.descriptionPlaceholder}
        value={description}
        maxLength={TASK_LIMITS.DESCRIPTION_MAX_LENGTH}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        onBlur={() => handleBlur("description")}
        error={touched.description ? errors.description : undefined}
        hint={t.form.descriptionHint}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          {t.form.cancel}
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={!title.trim()}
        >
          {isEditing ? t.form.saveSubmit : t.form.createSubmit}
        </Button>
      </div>
    </form>
  );
}

export function TaskFormModal({
  isOpen,
  onClose,
  taskToEdit,
  onSubmit,
  isSubmitting = false,
}: TaskFormModalProps) {
  const { t } = useLanguage();
  const isEditing = Boolean(taskToEdit);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t.form.editTitle : t.form.createTitle}
      description={isEditing ? t.form.editSubtitle : t.form.createSubtitle}
    >
      {isOpen && (
        <TaskFormFields
          key={taskToEdit ? taskToEdit.id : "new-task"}
          taskToEdit={taskToEdit}
          onClose={onClose}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
}

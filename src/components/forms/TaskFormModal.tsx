"use client";

import React, { useState } from "react";
import { CreateTaskInput, Task, UpdateTaskInput } from "@/features/tasks/types";
import {
  TASK_LIMITS,
  validateTaskInput,
} from "@/features/tasks/validation";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";

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

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (touched.title) {
      const res = validateTaskInput({ title: val, description }, isEditing);
      setErrors((prev) => ({ ...prev, title: res.errors.title }));
    }
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    if (touched.description) {
      const res = validateTaskInput({ title, description: val }, isEditing);
      setErrors((prev) => ({ ...prev, description: res.errors.description }));
    }
  };

  const handleBlur = (field: "title" | "description") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const res = validateTaskInput({ title, description }, isEditing);
    setErrors(res.errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ title: true, description: true });
    const validation = validateTaskInput({ title, description }, isEditing);

    if (!validation.isValid) {
      setErrors(validation.errors);
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
        label="Title"
        required
        placeholder="e.g. Implement authentication endpoint"
        value={title}
        maxLength={TASK_LIMITS.TITLE_MAX_LENGTH}
        onChange={(e) => handleTitleChange(e.target.value)}
        onBlur={() => handleBlur("title")}
        error={touched.title ? errors.title : undefined}
        hint={`1 to ${TASK_LIMITS.TITLE_MAX_LENGTH} characters`}
        autoFocus
      />

      {/* Description Textarea */}
      <Textarea
        label="Description (Optional)"
        placeholder="Add details, requirements, or acceptance criteria..."
        value={description}
        maxLength={TASK_LIMITS.DESCRIPTION_MAX_LENGTH}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        onBlur={() => handleBlur("description")}
        error={touched.description ? errors.description : undefined}
        hint="Brief context for this task"
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={!title.trim()}
        >
          {isEditing ? "Save Changes" : "Create Task"}
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
  const isEditing = Boolean(taskToEdit);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "Create New Task"}
      description={
        isEditing
          ? "Update the details for this task."
          : "Add a new task to your task management dashboard."
      }
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

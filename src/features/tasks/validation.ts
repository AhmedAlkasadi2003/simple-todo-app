import { CreateTaskInput, UpdateTaskInput } from "./types";

export interface ValidationResult {
  isValid: boolean;
  errors: {
    title?: string;
    description?: string;
  };
}

export const TASK_LIMITS = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

/**
 * Validates task input fields according to application rules.
 *
 * NOTE FOR BACKEND LEARNERS:
 * Client-side validation is purely for user experience (instant feedback).
 * The backend MUST validate all incoming requests independently to protect
 * data integrity and security.
 */
export function validateTaskInput(
  input: Partial<CreateTaskInput | UpdateTaskInput>,
  isUpdate = false
): ValidationResult {
  const errors: { title?: string; description?: string } = {};

  // Validate Title
  if (!isUpdate || input.title !== undefined) {
    const title = input.title ?? "";
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      errors.title = "Task title is required.";
    } else if (trimmedTitle.length < TASK_LIMITS.TITLE_MIN_LENGTH) {
      errors.title = `Task title must be at least ${TASK_LIMITS.TITLE_MIN_LENGTH} character.`;
    } else if (trimmedTitle.length > TASK_LIMITS.TITLE_MAX_LENGTH) {
      errors.title = `Task title cannot exceed ${TASK_LIMITS.TITLE_MAX_LENGTH} characters (currently ${trimmedTitle.length}).`;
    }
  }

  // Validate Description
  if (input.description !== undefined && input.description !== null) {
    const description = input.description.trim();
    if (description.length > TASK_LIMITS.DESCRIPTION_MAX_LENGTH) {
      errors.description = `Description cannot exceed ${TASK_LIMITS.DESCRIPTION_MAX_LENGTH} characters (currently ${description.length}).`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

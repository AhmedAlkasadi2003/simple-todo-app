import React, { forwardRef, useId } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      maxLength,
      value,
      id: customId,
      className = "",
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = customId || generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
            >
              {label}
              {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
            </label>
          )}
          {maxLength && (
            <span className="text-xs text-zinc-400">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          required={required}
          className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-colors focus:outline-none focus:ring-2 min-h-[96px] resize-y ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50"
              : "border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900/50"
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-xs text-zinc-500 dark:text-zinc-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

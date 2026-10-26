import React, { forwardRef, useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id: customId, className = "", ...props }, ref) => {
    const generatedId = useId();
    const selectId = customId || generatedId;

    return (
      <div className="flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          className={`rounded-lg border bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition-colors focus:outline-none focus:ring-2 cursor-pointer ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900/50"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

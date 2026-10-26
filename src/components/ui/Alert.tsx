import React from "react";
import { AlertCircleIcon, CloseIcon, InfoIcon } from "./Icons";
import { Button } from "./Button";

export interface AlertProps {
  type?: "error" | "success" | "info" | "warning";
  title?: string;
  message: string;
  details?: Record<string, string[]>;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function Alert({
  type = "info",
  title,
  message,
  details,
  onDismiss,
  onRetry,
  className = "",
}: AlertProps) {
  const styles = {
    error: {
      container:
        "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200",
      icon: "text-red-600 dark:text-red-400",
      button: "danger" as const,
    },
    success: {
      container:
        "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200",
      icon: "text-emerald-600 dark:text-emerald-400",
      button: "secondary" as const,
    },
    warning: {
      container:
        "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200",
      icon: "text-amber-600 dark:text-amber-400",
      button: "secondary" as const,
    },
    info: {
      container:
        "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200",
      icon: "text-blue-600 dark:text-blue-400",
      button: "primary" as const,
    },
  }[type];

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`rounded-lg border p-4 ${styles.container} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 ${styles.icon}`} aria-hidden="true">
          {type === "error" || type === "warning" ? (
            <AlertCircleIcon className="w-5 h-5" />
          ) : (
            <InfoIcon className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 text-sm">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="leading-relaxed">{message}</p>

          {/* Validation Details List */}
          {details && Object.keys(details).length > 0 && (
            <ul className="mt-2 list-disc list-inside space-y-1 text-xs opacity-90">
              {Object.entries(details).map(([field, msgs]) =>
                msgs.map((m, idx) => (
                  <li key={`${field}-${idx}`}>
                    <strong className="capitalize">{field}:</strong> {m}
                  </li>
                ))
              )}
            </ul>
          )}

          {onRetry && (
            <div className="mt-3">
              <Button size="sm" variant={styles.button} onClick={onRetry}>
                Try Again
              </Button>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

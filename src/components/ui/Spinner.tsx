import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function Spinner({
  size = "md",
  className = "",
  label = "Loading...",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-3",
  }[size];

  return (
    <div
      role="status"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <div
        className={`${sizeClasses} rounded-full border-current border-t-transparent animate-spin`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

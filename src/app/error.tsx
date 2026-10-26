"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AlertCircleIcon, RefreshIcon } from "@/components/ui/Icons";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log unexpected client error to monitoring service or console
    console.error("Unhandled App Router error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-md w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircleIcon className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Something went wrong
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 mb-6">
          {error.message ||
            "An unexpected error occurred while rendering this page."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="primary"
            leftIcon={<RefreshIcon className="w-4 h-4" />}
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}

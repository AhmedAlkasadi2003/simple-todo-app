import Link from "next/link";
import { ArrowLeftIcon } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-md w-full text-center">
        <span className="text-6xl font-black text-zinc-300 dark:text-zinc-700 block mb-2">
          404
        </span>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Page Not Found
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 mb-6">
          The requested page or route does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

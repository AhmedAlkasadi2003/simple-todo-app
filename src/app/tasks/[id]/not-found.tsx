import Link from "next/link";
import { ArrowLeftIcon } from "@/components/ui/Icons";

export default function TaskNotFound() {
  return (
    <div className="max-w-md mx-auto my-16 text-center px-4">
      <span className="text-5xl font-black text-zinc-300 dark:text-zinc-700 block mb-2">
        404
      </span>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        Task Not Found
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 mb-6">
        The task you are looking for does not exist or may have been deleted.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Return to Task List
      </Link>
    </div>
  );
}

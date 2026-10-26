export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="w-full h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 animate-pulse" />

      {/* Main content skeleton */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-96 bg-zinc-100 dark:bg-zinc-800/60 rounded" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>

        <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />

        <div className="flex flex-col gap-3">
          <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

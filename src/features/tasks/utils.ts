import {
  Task,
  TaskFilterStatus,
  TaskSortOption,
  TaskSummaryStats,
} from "./types";

/**
 * Format an ISO 8601 date string to an accessible, human-readable display string
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "Unknown date";
  }
}

/**
 * Computes summary counts for total, completed, and pending tasks
 */
export function calculateTaskStats(tasks: Task[]): TaskSummaryStats {
  const total = tasks.length;
  let completed = 0;
  for (const t of tasks) {
    if (t.status === "completed") {
      completed++;
    }
  }
  return {
    total,
    completed,
    pending: total - completed,
  };
}

/**
 * Filters and sorts tasks client-side.
 *
 * NOTE FOR BACKEND LEARNERS:
 * When a dataset is small (< 500 items), filtering and sorting on the client
 * is instant and requires zero server load. As datasets grow to thousands or
 * millions of records, these filtering and sorting operations are moved to
 * database queries using SQL WHERE and ORDER BY clauses via API query parameters.
 */
export function filterAndSortTasks(
  tasks: Task[],
  searchQuery: string,
  filterStatus: TaskFilterStatus,
  sortBy: TaskSortOption
): Task[] {
  let result = [...tasks];

  // 1. Search Query Filter
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    result = result.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(q);
      const descMatch =
        task.description !== null && task.description.toLowerCase().includes(q);
      return titleMatch || descMatch;
    });
  }

  // 2. Status Filter
  if (filterStatus !== "all") {
    result = result.filter((task) => task.status === filterStatus);
  }

  // 3. Sorting
  result.sort((a, b) => {
    switch (sortBy) {
      case "createdAt-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "createdAt-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "title-asc":
        return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      case "title-desc":
        return b.title.localeCompare(a.title, undefined, { sensitivity: "base" });
      default:
        return 0;
    }
  });

  return result;
}

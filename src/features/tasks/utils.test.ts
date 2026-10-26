import { describe, expect, it } from "vitest";
import { Task } from "./types";
import {
  calculateTaskStats,
  filterAndSortTasks,
  formatDate,
} from "./utils";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Banana task",
    description: "Prepare fruit smoothie",
    status: "pending",
    createdAt: "2026-10-20T10:00:00.000Z",
    updatedAt: "2026-10-20T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Apple task",
    description: "Eat an apple daily",
    status: "completed",
    createdAt: "2026-10-22T10:00:00.000Z",
    updatedAt: "2026-10-22T10:00:00.000Z",
  },
  {
    id: "3",
    title: "Cherry task",
    description: null,
    status: "pending",
    createdAt: "2026-10-25T10:00:00.000Z",
    updatedAt: "2026-10-25T10:00:00.000Z",
  },
];

describe("formatDate", () => {
  it("formats valid ISO timestamp into human-readable date", () => {
    const formatted = formatDate("2026-10-26T14:30:00.000Z");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("Oct");
  });

  it("handles invalid date strings gracefully", () => {
    expect(formatDate("not-a-date")).toBe("Unknown date");
  });
});

describe("calculateTaskStats", () => {
  it("computes total, completed, and pending counts", () => {
    const stats = calculateTaskStats(mockTasks);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(2);
  });

  it("returns zero counts for empty array", () => {
    const stats = calculateTaskStats([]);
    expect(stats.total).toBe(0);
    expect(stats.completed).toBe(0);
    expect(stats.pending).toBe(0);
  });
});

describe("filterAndSortTasks", () => {
  it("filters tasks by search query matching title", () => {
    const result = filterAndSortTasks(
      mockTasks,
      "apple",
      "all",
      "createdAt-desc"
    );
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Apple task");
  });

  it("filters tasks by search query matching description", () => {
    const result = filterAndSortTasks(
      mockTasks,
      "smoothie",
      "all",
      "createdAt-desc"
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters tasks by status", () => {
    const pending = filterAndSortTasks(mockTasks, "", "pending", "createdAt-desc");
    expect(pending).toHaveLength(2);
    expect(pending.every((t) => t.status === "pending")).toBe(true);

    const completed = filterAndSortTasks(
      mockTasks,
      "",
      "completed",
      "createdAt-desc"
    );
    expect(completed).toHaveLength(1);
    expect(completed[0].id).toBe("2");
  });

  it("sorts by createdAt-desc (newest first)", () => {
    const sorted = filterAndSortTasks(mockTasks, "", "all", "createdAt-desc");
    expect(sorted[0].id).toBe("3"); // Oct 25
    expect(sorted[1].id).toBe("2"); // Oct 22
    expect(sorted[2].id).toBe("1"); // Oct 20
  });

  it("sorts by createdAt-asc (oldest first)", () => {
    const sorted = filterAndSortTasks(mockTasks, "", "all", "createdAt-asc");
    expect(sorted[0].id).toBe("1"); // Oct 20
    expect(sorted[2].id).toBe("3"); // Oct 25
  });

  it("sorts by title-asc (alphabetical A-Z)", () => {
    const sorted = filterAndSortTasks(mockTasks, "", "all", "title-asc");
    expect(sorted[0].title).toBe("Apple task");
    expect(sorted[1].title).toBe("Banana task");
    expect(sorted[2].title).toBe("Cherry task");
  });

  it("sorts by title-desc (alphabetical Z-A)", () => {
    const sorted = filterAndSortTasks(mockTasks, "", "all", "title-desc");
    expect(sorted[0].title).toBe("Cherry task");
    expect(sorted[1].title).toBe("Banana task");
    expect(sorted[2].title).toBe("Apple task");
  });
});

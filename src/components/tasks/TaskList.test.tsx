import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskList } from "./TaskList";
import { Task } from "@/features/tasks/types";

describe("TaskList", () => {
  const sampleTasks: Task[] = [
    {
      id: "task-1",
      title: "Task One",
      description: null,
      status: "pending",
      createdAt: "2026-10-26T10:00:00.000Z",
      updatedAt: "2026-10-26T10:00:00.000Z",
    },
    {
      id: "task-2",
      title: "Task Two",
      description: null,
      status: "completed",
      createdAt: "2026-10-26T11:00:00.000Z",
      updatedAt: "2026-10-26T11:00:00.000Z",
    },
  ];

  it("renders loading skeleton when isLoading is true", () => {
    render(
      <TaskList
        tasks={[]}
        totalCount={0}
        isLoading={true}
        searchQuery=""
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Loading tasks")).toBeInTheDocument();
  });

  it("renders empty state when totalCount is 0", () => {
    const onCreateNew = vi.fn();
    render(
      <TaskList
        tasks={[]}
        totalCount={0}
        isLoading={false}
        searchQuery=""
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onCreateNew={onCreateNew}
        onClearFilters={vi.fn()}
      />
    );

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    const createBtn = screen.getByRole("button", { name: "Create First Task" });
    fireEvent.click(createBtn);
    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  it("renders empty search results when search yields 0 items", () => {
    const onClearFilters = vi.fn();
    render(
      <TaskList
        tasks={[]}
        totalCount={5}
        isLoading={false}
        searchQuery="non-existent-keyword"
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        onClearFilters={onClearFilters}
      />
    );

    expect(screen.getByText("No matching tasks found")).toBeInTheDocument();
    expect(
      screen.getByText(/non-existent-keyword/i)
    ).toBeInTheDocument();
    const resetBtn = screen.getByRole("button", {
      name: "Reset Search & Filters",
    });
    fireEvent.click(resetBtn);
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("renders list of task cards when tasks are provided", () => {
    render(
      <TaskList
        tasks={sampleTasks}
        totalCount={2}
        isLoading={false}
        searchQuery=""
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    expect(screen.getByText("Task One")).toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });
});

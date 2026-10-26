import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskCard } from "./TaskCard";
import { Task } from "@/features/tasks/types";

describe("TaskCard", () => {
  const pendingTask: Task = {
    id: "task-1",
    title: "Pending Sample Task",
    description: "Sample Description text",
    status: "pending",
    createdAt: "2026-10-26T10:00:00.000Z",
    updatedAt: "2026-10-26T10:00:00.000Z",
  };

  const completedTask: Task = {
    id: "task-2",
    title: "Completed Sample Task",
    description: null,
    status: "completed",
    createdAt: "2026-10-26T11:00:00.000Z",
    updatedAt: "2026-10-26T11:00:00.000Z",
  };

  it("renders pending task details and checkbox correctly", () => {
    render(
      <TaskCard
        task={pendingTask}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Pending Sample Task")).toBeInTheDocument();
    expect(screen.getByText("Sample Description text")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("renders completed task with line-through and checked status", () => {
    render(
      <TaskCard
        task={completedTask}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Completed Sample Task")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("calls onToggleStatus when checkbox is clicked", () => {
    const onToggle = vi.fn();
    render(
      <TaskCard
        task={pendingTask}
        onToggleStatus={onToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith("task-1");
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();
    render(
      <TaskCard
        task={pendingTask}
        onToggleStatus={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />
    );

    const editBtn = screen.getByLabelText(/Edit task/i);
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(pendingTask);
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <TaskCard
        task={pendingTask}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );

    const deleteBtn = screen.getByLabelText(/Delete task/i);
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(pendingTask);
  });
});

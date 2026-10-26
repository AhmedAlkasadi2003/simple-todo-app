import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskFormModal } from "./TaskFormModal";
import { Task } from "@/features/tasks/types";

describe("TaskFormModal", () => {
  it("renders create task modal when open", () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn().mockResolvedValue(true)}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Create New Task")).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it("populates fields when taskToEdit is provided", () => {
    const existingTask: Task = {
      id: "task-1",
      title: "Existing Task Title",
      description: "Existing Description",
      status: "pending",
      createdAt: "2026-10-26T10:00:00.000Z",
      updatedAt: "2026-10-26T10:00:00.000Z",
    };

    render(
      <TaskFormModal
        isOpen={true}
        taskToEdit={existingTask}
        onClose={vi.fn()}
        onSubmit={vi.fn().mockResolvedValue(true)}
      />
    );

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Task Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Description")).toBeInTheDocument();
  });

  it("calls onSubmit with entered values when submitted", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const onClose = vi.fn();

    render(
      <TaskFormModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const titleInput = screen.getByLabelText(/Title/i);
    const descInput = screen.getByLabelText(/Description/i);

    fireEvent.change(titleInput, { target: { value: "New Learn Task" } });
    fireEvent.change(descInput, { target: { value: "Understand REST" } });

    const submitBtn = screen.getByRole("button", { name: "Create Task" });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith({
      title: "New Learn Task",
      description: "Understand REST",
    });
  });

  it("does not render when isOpen is false", () => {
    render(
      <TaskFormModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn().mockResolvedValue(true)}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Task } from "@/features/tasks/types";

describe("DeleteConfirmDialog", () => {
  const task: Task = {
    id: "task-99",
    title: "Task to delete",
    description: null,
    status: "pending",
    createdAt: "2026-10-26T12:00:00.000Z",
    updatedAt: "2026-10-26T12:00:00.000Z",
  };

  it("renders task title and warning message", () => {
    render(
      <DeleteConfirmDialog
        isOpen={true}
        task={task}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Delete Task" })
    ).toBeInTheDocument();
    expect(screen.getByText(/“Task to delete”/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Task" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel" })
    ).toBeInTheDocument();
  });

  it("calls onConfirm when delete button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <DeleteConfirmDialog
        isOpen={true}
        task={task}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    const deleteBtn = screen.getByRole("button", { name: "Delete Task" });
    fireEvent.click(deleteBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button is clicked", () => {
    const onClose = vi.fn();
    render(
      <DeleteConfirmDialog
        isOpen={true}
        task={task}
        onClose={onClose}
        onConfirm={vi.fn()}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

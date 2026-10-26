import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { TaskDashboard } from "./TaskDashboard";
import { taskService, MockTaskService } from "@/lib/api";

describe("TaskDashboard Integration Flow", () => {
  beforeEach(() => {
    if (taskService instanceof MockTaskService) {
      taskService.resetToSampleTasks();
    }
  });

  it("loads and displays sample tasks from data service", async () => {
    render(<TaskDashboard />);

    // Initially shows loading state or header
    expect(screen.getByText("Task Management Dashboard")).toBeInTheDocument();

    // Awaits data load
    await waitFor(() => {
      expect(
        screen.getByText("Inspect Next.js App Router frontend")
      ).toBeInTheDocument();
    });

    // Check summary metrics rendered
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
  });

  it("filters tasks when user types in search input", async () => {
    render(<TaskDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("Inspect Next.js App Router frontend")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Search tasks by title or description/i
    );
    fireEvent.change(searchInput, { target: { value: "REST API contract" } });

    await waitFor(() => {
      expect(screen.getByText("Review REST API contract")).toBeInTheDocument();
      expect(
        screen.queryByText("Inspect Next.js App Router frontend")
      ).not.toBeInTheDocument();
    });
  });

  it("opens create task modal when 'New Task' button is clicked", async () => {
    render(<TaskDashboard />);

    const newTaskBtn = screen.getByRole("button", { name: "New Task" });
    fireEvent.click(newTaskBtn);

    expect(screen.getByText("Create New Task")).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  });
});

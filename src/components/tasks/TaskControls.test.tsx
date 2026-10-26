import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskControls } from "./TaskControls";

describe("TaskControls", () => {
  const stats = { total: 10, pending: 6, completed: 4 };

  it("renders search input, sort dropdown, and status filter buttons", () => {
    render(
      <TaskControls
        searchQuery=""
        statusFilter="all"
        sortBy="createdAt-desc"
        stats={stats}
        onSearchChange={vi.fn()}
        onStatusFilterChange={vi.fn()}
        onSortChange={vi.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText(/Search tasks by title or description/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Filter by All/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Filter by Pending/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Filter by Completed/i })
    ).toBeInTheDocument();
  });

  it("calls onSearchChange when user types in search input", () => {
    const onSearchChange = vi.fn();
    render(
      <TaskControls
        searchQuery=""
        statusFilter="all"
        sortBy="createdAt-desc"
        stats={stats}
        onSearchChange={onSearchChange}
        onStatusFilterChange={vi.fn()}
        onSortChange={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(
      /Search tasks by title or description/i
    );
    fireEvent.change(input, { target: { value: "backend" } });
    expect(onSearchChange).toHaveBeenCalledWith("backend");
  });

  it("calls onStatusFilterChange when filter tab is clicked", () => {
    const onFilterChange = vi.fn();
    render(
      <TaskControls
        searchQuery=""
        statusFilter="all"
        sortBy="createdAt-desc"
        stats={stats}
        onSearchChange={vi.fn()}
        onStatusFilterChange={onFilterChange}
        onSortChange={vi.fn()}
      />
    );

    const pendingBtn = screen.getByRole("button", { name: /Filter by Pending/i });
    fireEvent.click(pendingBtn);
    expect(onFilterChange).toHaveBeenCalledWith("pending");
  });

  it("calls onSortChange when sort dropdown changes", () => {
    const onSortChange = vi.fn();
    render(
      <TaskControls
        searchQuery=""
        statusFilter="all"
        sortBy="createdAt-desc"
        stats={stats}
        onSearchChange={vi.fn()}
        onStatusFilterChange={vi.fn()}
        onSortChange={onSortChange}
      />
    );

    const select = screen.getByLabelText(/Sort tasks by/i);
    fireEvent.change(select, { target: { value: "title-asc" } });
    expect(onSortChange).toHaveBeenCalledWith("title-asc");
  });
});

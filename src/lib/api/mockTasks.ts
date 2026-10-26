import {
  CreateTaskInput,
  Task,
  TaskQueryParams,
  UpdateTaskInput,
} from "@/features/tasks/types";
import { ApiError } from "./errors";
import { TaskService } from "./types";

const STORAGE_KEY = "simple_todo_mock_tasks_v1";

const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: "task-101",
    title: "Inspect Next.js App Router frontend",
    description: "Review component structure, layout, and page routing conventions.",
    status: "completed",
    createdAt: "2026-10-26T09:00:00.000Z",
    updatedAt: "2026-10-26T09:30:00.000Z",
  },
  {
    id: "task-102",
    title: "Review REST API contract",
    description: "Study GET, POST, PATCH, and DELETE endpoints defined in docs/API_CONTRACT.md.",
    status: "completed",
    createdAt: "2026-10-26T10:15:00.000Z",
    updatedAt: "2026-10-26T11:00:00.000Z",
  },
  {
    id: "task-103",
    title: "Implement backend GET /tasks endpoint",
    description: "Build an Express, Fastify, or Nest.js route returning tasks as JSON.",
    status: "pending",
    createdAt: "2026-10-26T11:30:00.000Z",
    updatedAt: "2026-10-26T11:30:00.000Z",
  },
  {
    id: "task-104",
    title: "Add input validation on the backend",
    description: "Validate task titles (required, 1-100 chars) and return structured 400 Bad Request.",
    status: "pending",
    createdAt: "2026-10-26T12:00:00.000Z",
    updatedAt: "2026-10-26T12:00:00.000Z",
  },
  {
    id: "task-105",
    title: "Connect SQLite or PostgreSQL database",
    description: "Replace in-memory backend arrays with persistent SQL storage and migrations.",
    status: "pending",
    createdAt: "2026-10-26T13:45:00.000Z",
    updatedAt: "2026-10-26T13:45:00.000Z",
  },
];

/**
 * Mock Task Service implementing the TaskService contract.
 *
 * Simulates network latency and persists changes to browser localStorage
 * solely for local frontend preview before the backend is constructed.
 */
export class MockTaskService implements TaskService {
  private simulatedLatencyMs: number;

  constructor(simulatedLatencyMs = 250) {
    this.simulatedLatencyMs = simulatedLatencyMs;
  }

  private async delay(signal?: AbortSignal): Promise<void> {
    if (this.simulatedLatencyMs <= 0) return;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        resolve();
      }, this.simulatedLatencyMs);

      if (signal) {
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(
            new ApiError({
              message: "Request cancelled.",
              status: 0,
              code: "REQUEST_ABORTED",
            })
          );
        });
      }
    });
  }

  private getStoredTasks(): Task[] {
    if (typeof window === "undefined") {
      return [...INITIAL_SAMPLE_TASKS];
    }

    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (!item) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(INITIAL_SAMPLE_TASKS)
        );
        return [...INITIAL_SAMPLE_TASKS];
      }
      const parsed = JSON.parse(item);
      return Array.isArray(parsed) ? parsed : [...INITIAL_SAMPLE_TASKS];
    } catch {
      return [...INITIAL_SAMPLE_TASKS];
    }
  }

  private saveStoredTasks(tasks: Task[]): void {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage quota or privacy sandbox limitation
    }
  }

  async getTasks(params?: TaskQueryParams, signal?: AbortSignal): Promise<Task[]> {
    await this.delay(signal);

    let tasks = this.getStoredTasks();

    // Search filter
    if (params?.search) {
      const q = params.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (params?.status) {
      tasks = tasks.filter((t) => t.status === params.status);
    }

    // Sorting
    if (params?.sortBy) {
      const sortBy = params.sortBy;
      const order = params.order || "asc";

      tasks.sort((a, b) => {
        let valA = a[sortBy] || "";
        let valB = b[sortBy] || "";
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Deep clone to prevent direct outside mutations
    return JSON.parse(JSON.stringify(tasks));
  }

  async getTaskById(id: string, signal?: AbortSignal): Promise<Task> {
    await this.delay(signal);

    const tasks = this.getStoredTasks();
    const found = tasks.find((t) => t.id === id);

    if (!found) {
      throw new ApiError({
        message: `Task with ID "${id}" was not found.`,
        status: 404,
        code: "TASK_NOT_FOUND",
      });
    }

    return JSON.parse(JSON.stringify(found));
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    await this.delay();

    const trimmedTitle = input.title?.trim() || "";
    if (!trimmedTitle) {
      throw new ApiError({
        message: "Validation failed: Title is required.",
        status: 400,
        code: "VALIDATION_ERROR",
        details: { title: ["Title is required."] },
      });
    }

    const tasks = this.getStoredTasks();
    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: trimmedTitle,
      description: input.description?.trim() || null,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    tasks.unshift(newTask);
    this.saveStoredTasks(tasks);

    return JSON.parse(JSON.stringify(newTask));
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    await this.delay();

    const tasks = this.getStoredTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new ApiError({
        message: `Task with ID "${id}" was not found.`,
        status: 404,
        code: "TASK_NOT_FOUND",
      });
    }

    const existing = tasks[index];
    const updatedTitle =
      input.title !== undefined ? input.title.trim() : existing.title;

    if (input.title !== undefined && !updatedTitle) {
      throw new ApiError({
        message: "Validation failed: Title cannot be empty.",
        status: 400,
        code: "VALIDATION_ERROR",
        details: { title: ["Title cannot be empty."] },
      });
    }

    const updatedTask: Task = {
      ...existing,
      title: updatedTitle,
      description:
        input.description !== undefined
          ? input.description
            ? input.description.trim()
            : null
          : existing.description,
      status: input.status !== undefined ? input.status : existing.status,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    this.saveStoredTasks(tasks);

    return JSON.parse(JSON.stringify(updatedTask));
  }

  async deleteTask(id: string): Promise<void> {
    await this.delay();

    const tasks = this.getStoredTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new ApiError({
        message: `Task with ID "${id}" was not found.`,
        status: 404,
        code: "TASK_NOT_FOUND",
      });
    }

    tasks.splice(index, 1);
    this.saveStoredTasks(tasks);
  }

  /**
   * Educational utility to reset mock storage back to initial sample tasks
   */
  public resetToSampleTasks(): void {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(INITIAL_SAMPLE_TASKS)
      );
    }
  }
}

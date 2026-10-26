import {
  CreateTaskInput,
  Task,
  TaskQueryParams,
  UpdateTaskInput,
} from "@/features/tasks/types";

/**
 * Common Task Service Contract
 *
 * Both the real REST API client (`TaskApiClient`) and the mock adapter (`MockTaskService`)
 * implement this exact interface. This ensures that switching between mock data and the real
 * backend requires ZERO changes to any UI components or hooks.
 */
export interface TaskService {
  /**
   * Fetch all tasks, optionally filtered, searched, and sorted by query parameters
   */
  getTasks(params?: TaskQueryParams, signal?: AbortSignal): Promise<Task[]>;

  /**
   * Fetch a single task by its unique ID
   */
  getTaskById(id: string, signal?: AbortSignal): Promise<Task>;

  /**
   * Create a new task
   */
  createTask(input: CreateTaskInput): Promise<Task>;

  /**
   * Partially update an existing task (title, description, status)
   */
  updateTask(id: string, input: UpdateTaskInput): Promise<Task>;

  /**
   * Permanently delete a task by ID
   */
  deleteTask(id: string): Promise<void>;
}

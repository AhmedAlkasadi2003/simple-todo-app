import {
  ApiResponse,
  CreateTaskInput,
  Task,
  TaskQueryParams,
  UpdateTaskInput,
} from "@/features/tasks/types";
import { request } from "./client";
import { TaskService } from "./types";
import { getApiUrl } from "../config";

/**
 * Real REST API client implementing the TaskService contract.
 * Connects to the backend REST server configured via NEXT_PUBLIC_API_URL.
 */
export class TaskApiClient implements TaskService {
  private get baseUrl(): string {
    return getApiUrl();
  }

  /**
   * Helper to unwrap responses supporting both `{ data: T }` envelope
   * and raw `T` responses.
   */
  private unwrap<T>(response: ApiResponse<T> | T): T {
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      (response as ApiResponse<T>).data !== undefined
    ) {
      return (response as ApiResponse<T>).data;
    }
    return response as T;
  }

  async getTasks(params?: TaskQueryParams, signal?: AbortSignal): Promise<Task[]> {
    const queryParams: Record<string, string | undefined> = {};

    if (params?.search) queryParams.search = params.search;
    if (params?.status) queryParams.status = params.status;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.order) queryParams.order = params.order;

    const res = await request<ApiResponse<Task[]> | Task[]>(
      `${this.baseUrl}/tasks`,
      {
        method: "GET",
        params: queryParams,
        signal,
      }
    );

    const tasks = this.unwrap(res);
    return Array.isArray(tasks) ? tasks : [];
  }

  async getTaskById(id: string, signal?: AbortSignal): Promise<Task> {
    const encodedId = encodeURIComponent(id);
    const res = await request<ApiResponse<Task> | Task>(
      `${this.baseUrl}/tasks/${encodedId}`,
      {
        method: "GET",
        signal,
      }
    );

    return this.unwrap(res);
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const res = await request<ApiResponse<Task> | Task>(`${this.baseUrl}/tasks`, {
      method: "POST",
      body: JSON.stringify(input),
    });

    return this.unwrap(res);
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const encodedId = encodeURIComponent(id);
    const res = await request<ApiResponse<Task> | Task>(
      `${this.baseUrl}/tasks/${encodedId}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      }
    );

    return this.unwrap(res);
  }

  async deleteTask(id: string): Promise<void> {
    const encodedId = encodeURIComponent(id);
    await request<void>(`${this.baseUrl}/tasks/${encodedId}`, {
      method: "DELETE",
    });
  }
}

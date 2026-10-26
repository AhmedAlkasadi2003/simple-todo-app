import { isMockMode } from "../config";
import { MockTaskService } from "./mockTasks";
import { TaskApiClient } from "./tasks";
import { TaskService } from "./types";

/**
 * Singleton instances
 */
const realApiClient = new TaskApiClient();
const mockApiClient = new MockTaskService();

/**
 * Returns the active TaskService implementation based on NEXT_PUBLIC_DATA_MODE.
 *
 * NOTE: If NEXT_PUBLIC_DATA_MODE="api", requests hit real endpoints. If the backend
 * is down or returns errors, the real error is propagated directly to the UI—we NEVER
 * silently fall back to mock data!
 */
export function getTaskService(): TaskService {
  if (isMockMode()) {
    return mockApiClient;
  }
  return realApiClient;
}

export const taskService = getTaskService();

export * from "./types";
export * from "./errors";
export * from "./client";
export { MockTaskService } from "./mockTasks";
export { TaskApiClient } from "./tasks";

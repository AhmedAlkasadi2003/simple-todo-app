import { beforeEach, describe, expect, it } from "vitest";
import { MockTaskService } from "./mockTasks";
import { ApiError } from "./errors";

describe("MockTaskService", () => {
  let service: MockTaskService;

  beforeEach(() => {
    // 0ms simulated latency for fast unit tests
    service = new MockTaskService(0);
    service.resetToSampleTasks();
  });

  it("seeds initial tasks on first load", async () => {
    const tasks = await service.getTasks();
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0]).toHaveProperty("id");
    expect(tasks[0]).toHaveProperty("title");
    expect(tasks[0]).toHaveProperty("status");
  });

  it("fetches a specific task by id", async () => {
    const tasks = await service.getTasks();
    const target = tasks[0];

    const fetched = await service.getTaskById(target.id);
    expect(fetched.id).toBe(target.id);
    expect(fetched.title).toBe(target.title);
  });

  it("throws 404 ApiError when task id does not exist", async () => {
    await expect(service.getTaskById("non-existent-id")).rejects.toThrow(
      ApiError
    );

    try {
      await service.getTaskById("non-existent-id");
    } catch (err) {
      const apiErr = err as ApiError;
      expect(apiErr.status).toBe(404);
      expect(apiErr.code).toBe("TASK_NOT_FOUND");
    }
  });

  it("creates a new task with ISO timestamps and pending status", async () => {
    const initialTasks = await service.getTasks();
    const created = await service.createTask({
      title: "Write integration tests",
      description: "Ensure 100% coverage",
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe("Write integration tests");
    expect(created.description).toBe("Ensure 100% coverage");
    expect(created.status).toBe("pending");
    expect(new Date(created.createdAt).getTime()).not.toBeNaN();

    const afterTasks = await service.getTasks();
    expect(afterTasks.length).toBe(initialTasks.length + 1);
  });

  it("rejects creating task with empty title with 400 ApiError", async () => {
    await expect(service.createTask({ title: "   " })).rejects.toThrow(ApiError);
  });

  it("updates an existing task partially", async () => {
    const tasks = await service.getTasks();
    const target = tasks[0];

    const updated = await service.updateTask(target.id, {
      status: target.status === "completed" ? "pending" : "completed",
    });

    expect(updated.id).toBe(target.id);
    expect(updated.status).not.toBe(target.status);
    expect(updated.title).toBe(target.title); // Title remained unchanged
  });

  it("deletes a task successfully", async () => {
    const initialTasks = await service.getTasks();
    const target = initialTasks[0];

    await service.deleteTask(target.id);

    const afterTasks = await service.getTasks();
    expect(afterTasks.length).toBe(initialTasks.length - 1);
    expect(afterTasks.find((t) => t.id === target.id)).toBeUndefined();
  });
});

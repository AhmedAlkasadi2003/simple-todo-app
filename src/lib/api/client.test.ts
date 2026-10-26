import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { request } from "./client";
import { ApiError } from "./errors";

describe("HTTP Client request()", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("handles successful JSON response", async () => {
    const mockData = { data: [{ id: "1", title: "Task 1" }] };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => mockData,
    });

    const result = await request<typeof mockData>("http://localhost:4000/api/v1/tasks");
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("appends query parameters correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ data: [] }),
    });

    await request("http://localhost:4000/api/v1/tasks", {
      params: { search: "test", status: "pending", empty: undefined },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:4000/api/v1/tasks?search=test&status=pending",
      expect.anything()
    );
  });

  it("handles 204 No Content response gracefully without throwing", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers(),
    });

    const result = await request<void>("http://localhost:4000/api/v1/tasks/123", {
      method: "DELETE",
    });

    expect(result).toBeUndefined();
  });

  it("normalizes structured API error envelope into ApiError", async () => {
    const errorBody = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Title is required.",
        details: {
          title: ["The title field cannot be empty."],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => errorBody,
    });

    await expect(
      request("http://localhost:4000/api/v1/tasks", { method: "POST" })
    ).rejects.toThrow(ApiError);

    try {
      await request("http://localhost:4000/api/v1/tasks", { method: "POST" });
    } catch (err) {
      const apiErr = err as ApiError;
      expect(apiErr.status).toBe(400);
      expect(apiErr.code).toBe("VALIDATION_ERROR");
      expect(apiErr.message).toBe("Title is required.");
      expect(apiErr.details?.title).toContain(
        "The title field cannot be empty."
      );
    }
  });

  it("handles network failure and returns ApiError with isNetworkError flag", async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    try {
      await request("http://localhost:4000/api/v1/tasks");
      expect.fail("Should have thrown");
    } catch (err) {
      const apiErr = err as ApiError;
      expect(apiErr).toBeInstanceOf(ApiError);
      expect(apiErr.code).toBe("NETWORK_ERROR");
      expect(apiErr.isNetworkError).toBe(true);
      expect(apiErr.status).toBe(0);
    }
  });

  it("handles plain text error response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      headers: new Headers({ "content-type": "text/plain" }),
      text: async () => "Bad Gateway proxy error",
    });

    try {
      await request("http://localhost:4000/api/v1/tasks");
      expect.fail("Should have thrown");
    } catch (err) {
      const apiErr = err as ApiError;
      expect(apiErr).toBeInstanceOf(ApiError);
      expect(apiErr.status).toBe(502);
      expect(apiErr.message).toContain("Bad Gateway proxy error");
    }
  });
});

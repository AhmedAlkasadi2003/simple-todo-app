import { describe, expect, it } from "vitest";
import { TASK_LIMITS, validateTaskInput } from "./validation";

describe("validateTaskInput", () => {
  it("rejects missing or empty title on creation", () => {
    const res1 = validateTaskInput({});
    expect(res1.isValid).toBe(false);
    expect(res1.errors.title).toBeDefined();

    const res2 = validateTaskInput({ title: "" });
    expect(res2.isValid).toBe(false);
    expect(res2.errors.title).toContain("required");
  });

  it("rejects whitespace-only title", () => {
    const res = validateTaskInput({ title: "     " });
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toContain("required");
  });

  it("rejects title exceeding maximum character length", () => {
    const tooLongTitle = "a".repeat(TASK_LIMITS.TITLE_MAX_LENGTH + 1);
    const res = validateTaskInput({ title: tooLongTitle });
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toContain(
      `cannot exceed ${TASK_LIMITS.TITLE_MAX_LENGTH}`
    );
  });

  it("accepts valid title within limits", () => {
    const res = validateTaskInput({ title: "Build REST API" });
    expect(res.isValid).toBe(true);
    expect(res.errors.title).toBeUndefined();
  });

  it("rejects description exceeding 500 characters", () => {
    const longDesc = "x".repeat(TASK_LIMITS.DESCRIPTION_MAX_LENGTH + 5);
    const res = validateTaskInput({
      title: "Valid title",
      description: longDesc,
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.description).toContain(
      `cannot exceed ${TASK_LIMITS.DESCRIPTION_MAX_LENGTH}`
    );
  });

  it("allows omitting description or empty description", () => {
    const res1 = validateTaskInput({ title: "Valid title" });
    expect(res1.isValid).toBe(true);

    const res2 = validateTaskInput({ title: "Valid title", description: "" });
    expect(res2.isValid).toBe(true);
  });

  it("handles update validation allowing omitted title", () => {
    const res = validateTaskInput(
      { description: "New updated description" },
      true
    );
    expect(res.isValid).toBe(true);
  });

  it("rejects empty title when provided during update", () => {
    const res = validateTaskInput({ title: "   " }, true);
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toBeDefined();
  });
});

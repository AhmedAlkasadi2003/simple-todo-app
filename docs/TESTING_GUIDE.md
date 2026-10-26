# Testing Guide — Simple Todo App

## 1. Testing Philosophy & Architecture

Testing in **Simple Tasks** verifies critical user interactions, data transformations, and API contract compliance without relying on fragile implementation details.

### Test Stack
- **Test Runner**: [Vitest](https://vitest.dev/) (lightning-fast, native ESM and TypeScript support).
- **DOM Environment**: `jsdom`.
- **Component Testing**: `@testing-library/react`.
- **Assertions**: Vitest matchers extended with `@testing-library/jest-dom`.

---

## 2. Test Suite Overview

The project contains **55 automated tests** across 10 specialized test files:

| Category | File | What is Tested |
| :--- | :--- | :--- |
| **Validation** | `src/features/tasks/validation.test.ts` | Required title, whitespace rejection, min/max length limits, description length limits, partial update validation. |
| **Utilities** | `src/features/tasks/utils.test.ts` | ISO date formatting, task metrics calculation, client-side filtering by search and status, multi-criteria sorting. |
| **HTTP Client** | `src/lib/api/client.test.ts` | Successful JSON parsing, query parameter encoding, `204 No Content` handling, structured error normalization (`ApiError`), network dropouts. |
| **Mock Adapter** | `src/lib/api/mockTasks.test.ts` | Initial sample data seeding, `getTasks` filtering, `getTaskById` with 404 handling, `createTask`, `updateTask`, `deleteTask`. |
| **Form Dialogs** | `src/components/forms/TaskFormModal.test.tsx` | Create modal rendering, edit modal pre-population, validation enforcement, submit handling. |
| **Delete Dialog** | `src/components/forms/DeleteConfirmDialog.test.tsx` | Dialog title rendering, cancel action, confirmed delete action. |
| **Task Cards** | `src/components/tasks/TaskCard.test.tsx` | Pending and completed visual states, checkbox toggle, edit click, delete click. |
| **Task Controls** | `src/components/tasks/TaskControls.test.tsx` | Search input typing, status filter pill toggling, sort dropdown selection. |
| **Task List** | `src/components/tasks/TaskList.test.tsx` | Loading skeleton state, zero-tasks empty state, zero-search-results empty state, card list rendering. |
| **Dashboard Flow**| `src/components/tasks/TaskDashboard.test.tsx`| End-to-end user flow: initial load, search filtering, and opening create task modal. |

---

## 3. Running the Test Suite

### Run All Tests Once
```bash
npm run test
```

### Run Tests in Watch Mode (Auto-rerun on file changes)
```bash
npm run test:watch
```

### Run a Specific Test File
```bash
npx vitest run src/lib/api/client.test.ts
```

---

## 4. Mocking & Isolation Strategies

### 1. HTTP Fetch Mocking
In `src/lib/api/client.test.ts`, native `fetch` is mocked using `vi.fn()`:
```typescript
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  headers: new Headers({ "content-type": "application/json" }),
  json: async () => ({ data: [{ id: "1", title: "Task 1" }] }),
});
```

### 2. Mock Adapter Isolation
In `src/lib/api/mockTasks.test.ts`, the mock service is instantiated with `0ms` simulated latency so that unit tests execute instantly in under 35ms:
```typescript
const service = new MockTaskService(0);
```

### 3. Accessible Query Conventions
Tests strictly query elements by accessible roles and labels rather than CSS selectors or test IDs:
```typescript
// Recommended accessible queries:
screen.getByRole("button", { name: "Create Task" });
screen.getByRole("checkbox", { name: /Mark "..." as completed/i });
screen.getByLabelText(/Title/i);
```
This guarantees that if the interface is accessible to automated tests, it is equally accessible to keyboard navigation and screen readers.

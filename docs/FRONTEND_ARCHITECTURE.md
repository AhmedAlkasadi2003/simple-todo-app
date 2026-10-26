# Frontend Architecture — Simple Todo App

## 1. Directory Structure

The application follows an intuitive, modular structure inside `src/`:

```
src/
├── app/                          # Next.js App Router (pages, layouts, error boundaries)
│   ├── layout.tsx                # Root layout with HTML shell, fonts, and dark mode base
│   ├── page.tsx                  # Home route (renders TaskDashboard)
│   ├── loading.tsx               # Route-level loading skeleton
│   ├── error.tsx                 # Route-level error boundary with retry
│   ├── not-found.tsx             # Global 404 page
│   └── tasks/
│       └── [id]/
│           ├── page.tsx          # Standalone dynamic route for individual task details
│           └── not-found.tsx     # Task-specific 404 handler
├── components/                   # Reusable UI presentation layer
│   ├── ui/                       # Design system primitives (Button, Input, Modal, Badge, etc.)
│   ├── layout/                   # Header, Footer, ModeIndicator
│   ├── tasks/                    # TaskCard, TaskList, TaskStats, TaskControls, TaskDetails
│   └── forms/                    # TaskFormModal, DeleteConfirmDialog
├── features/                     # Feature domain logic (state, hooks, validation, utils)
│   └── tasks/
│       ├── types.ts              # Core task entities, inputs, responses, and filters
│       ├── validation.ts         # Pure client validation rules (lengths, required fields)
│       ├── hooks.ts              # useTasks and useTask state-management hooks
│       └── utils.ts              # Pure utilities (filtering, sorting, formatting, stats)
├── lib/                          # Infrastructure & API communication
│   ├── config.ts                 # Environment variable parsing and mode detection
│   └── api/
│       ├── types.ts              # TaskService interface definition
│       ├── errors.ts             # ApiError class and normalization helpers
│       ├── client.ts             # Native fetch HTTP wrapper with error & 204 handling
│       ├── tasks.ts              # Real REST API client implementing TaskService
│       ├── mockTasks.ts          # Mock adapter with localStorage persistence
│       └── index.ts              # Service provider factory
└── test/
    └── setup.ts                  # Vitest & Jest DOM matchers setup
```

---

## 2. Server Components vs. Client Components

Next.js App Router renders React Server Components (RSC) on the server by default. Client Components are explicitly designated with the `"use client"` directive.

| Component | Type | Responsibility |
| :--- | :--- | :--- |
| `src/app/layout.tsx` | Server Component | Renders the HTML document skeleton, loads Geist fonts, and defines global page metadata. |
| `src/app/page.tsx` | Server Component | Acts as the entry point for `/`, rendering the interactive `<TaskDashboard />`. |
| `src/app/tasks/[id]/page.tsx` | Server Component | Resolves dynamic route `params: Promise<{ id: string }>` and mounts `<TaskDetails />`. |
| `src/components/tasks/TaskDashboard.tsx` | Client Component | Manages search query, filter pills, sorting options, and handles create/edit/delete modals. |
| `src/components/tasks/TaskDetails.tsx` | Client Component | Manages single task state, toggling completion, and standalone task updates. |
| `src/components/ui/Modal.tsx` | Client Component | Manages document body scroll locking, keyboard ESC listener, and backdrop click handlers. |

---

## 3. Data Flow Architecture

The data flow is strictly unidirectional:

```
[User Action: Click / Submit]
           │
           ▼
[Custom React Hook: useTasks / useTask]
           │
           ▼
[Service Abstraction: TaskService]
           │
   ┌───────┴───────┐
   ▼               ▼
[Mock Adapter]   [REST Client (fetch)]
(localStorage)   (http://localhost:4000/api/v1)
   │               │
   └───────┬───────┘
           │
     Returns Task
           │
           ▼
[Update React State: setTasks]
           │
           ▼
[Re-render UI Components]
```

### 1. Presentation Layer (`components/`)
Components do **not** construct API URLs, manipulate `localStorage`, or directly parse HTTP responses. They receive data and action callbacks via props:
```tsx
<TaskCard
  key={task.id}
  task={task}
  onToggleStatus={toggleTaskStatus}
  onEdit={(task) => setTaskToEdit(task)}
  onDelete={(task) => setTaskToDelete(task)}
/>
```

### 2. Application State Layer (`features/tasks/hooks.ts`)
The `useTasks` hook encapsulates all state transitions, loading indicators, and error boundaries:
- `tasks`: Full list of tasks fetched from the service.
- `filteredTasks`: Derived memoized list filtered by search term and status, and sorted.
- `stats`: Derived memoized counts (`total`, `completed`, `pending`).
- `isLoading`: Tracks initial data retrieval.
- `isSubmitting`: Disables buttons and prevents duplicate requests while an operation is in-flight.
- `error`: Holds any normalized `ApiError` for display.

### 3. API Communication Layer (`lib/api/`)
The `httpClient` (`client.ts`) wraps `fetch`:
- Sets `Content-Type: application/json` for requests with a body.
- Appends query parameters safely via `URLSearchParams`.
- Inspects `res.status === 204` to avoid parsing empty bodies.
- Catches network dropouts and wraps them in `ApiError` with `isNetworkError: true`.
- Parses structured backend errors `{ error: { code, message, details } }`.

---

## 4. Form State & Validation

Forms use **uncontrolled/controlled hybrid state with key-based resets**:

```tsx
// Inside TaskFormModal.tsx
{isOpen && (
  <TaskFormFields
    key={taskToEdit ? taskToEdit.id : "new-task"}
    taskToEdit={taskToEdit}
    onClose={onClose}
    onSubmit={onSubmit}
    isSubmitting={isSubmitting}
  />
)}
```
- **Key-based Reset**: Rendering `<TaskFormFields key={...} />` ensures that opening a new modal or switching to a different task mounts a completely fresh state instance without calling `setState` inside `useEffect`.
- **Validation**: `validateTaskInput()` runs on blur and on submit. It checks:
  - Required non-whitespace title (1 to 100 characters).
  - Optional description length (max 500 characters).

---

## 5. Where a Beginner Should Look to Debug

| Problem / Symptom | Files to Inspect |
| :--- | :--- |
| **A field is missing or named differently from backend** | `src/features/tasks/types.ts` and `src/lib/api/tasks.ts` |
| **API request URL or query params are wrong** | `src/lib/api/client.ts` (`request` function) and `src/lib/api/tasks.ts` |
| **Data fails to load with CORS or Network Error** | `src/lib/api/client.ts` and verify backend CORS headers |
| **Task filter or sorting behaves unexpectedly** | `src/features/tasks/utils.ts` (`filterAndSortTasks` function) |
| **Modal does not close or button stays disabled** | `src/components/forms/TaskFormModal.tsx` and `useTasks` hook (`isSubmitting`) |
| **Validation messages do not appear** | `src/features/tasks/validation.ts` |
| **Switching between Mock and Real API** | `.env.local` and `src/lib/config.ts` |

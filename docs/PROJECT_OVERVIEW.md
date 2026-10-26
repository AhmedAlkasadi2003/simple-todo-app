# Project Overview — Simple Todo App

## 1. Introduction

**Simple Tasks** is a modern, responsive, and robust task-management application built using **Next.js App Router**, **TypeScript**, and **Tailwind CSS**.

The project serves a dual purpose:
1. **Production-Ready Frontend**: A polished, accessible, and user-friendly interface for managing everyday tasks.
2. **Pedagogical Blueprint**: A clean reference implementation designed specifically to teach frontend developers backend concepts by demonstrating how frontend features map directly to HTTP methods, REST endpoints, database schemas, and server-side validation.

---

## 2. Division of Responsibilities

To maximize educational clarity, this codebase enforces a strict separation:
- **Frontend (Implemented)**: Renders the interface, manages user input and client state, provides immediate feedback, and communicates with a configurable REST API client or mock adapter.
- **Backend (To be built manually by the human instructor)**: Handles persistent storage in a database (e.g. SQLite, PostgreSQL), enforces server-side business rules, authenticates requests, and provides RESTful endpoints.
- **Learner Experience**: Connects the frontend to the backend step-by-step, understanding how every button click, form submission, and filter maps to an HTTP request and server action.

---

## 3. What Has Been Implemented

The application implements all core features required of a production-quality task application:

1. **Task Listing**: Displays tasks in clear, readable cards with title, description, timestamps, and status badges.
2. **Task Creation**: Dedicated modal dialog with instant client-side validation and character counting.
3. **Task Details**: Dedicated route (`/tasks/[id]`) showing standalone fetching and full task metadata.
4. **Task Editing**: Edit modal allowing partial updates to title and description.
5. **Completion Toggle**: One-click checkbox action toggling between `"pending"` and `"completed"` states.
6. **Deletion with Confirmation**: Modal confirmation dialog preventing accidental deletion.
7. **Search**: Real-time filtering across titles and descriptions.
8. **Status Filtering**: Filter pills for `All`, `Pending`, and `Completed` with dynamic counts.
9. **Sorting**: Sort by creation date (newest/oldest) or alphabetically (A-Z / Z-A).
10. **State Handling**: Distinct visual representations for:
    - Initial data loading (animated skeletons)
    - Empty states (no tasks in project vs. no matching search results)
    - Form submission in progress (button spinners and disabled inputs)
    - Success notifications (auto-dismissing alerts)
    - Error alerts (structured error codes, details, and retry actions)
11. **Dual Data Modes**:
    - **Mock Mode**: Pre-seeded realistic tasks persisting in browser `localStorage` for immediate frontend exploration without a backend.
    - **Real API Mode**: Connects directly to a configured backend REST URL with strict error propagation (no silent fallback).
12. **Automated Test Suite**: 55 automated tests across 10 test suites covering components, utilities, validation, and API client behavior using Vitest and React Testing Library.

---

## 4. What Has Deliberately Not Been Implemented

To keep the application accessible and beginner-friendly, the following features have been intentionally omitted from the frontend:
- **User Authentication & Login**: No JWT tokens, session cookies, or OAuth providers (avoids premature complexity).
- **Roles & Permissions**: All tasks are treated as belonging to a single workspace.
- **Real-Time WebSockets**: Standard HTTP polling / re-fetching is used instead of complex socket channels.
- **File Attachments & Rich Text**: Plain text titles and descriptions keep payloads clean and focused.
- **Global State Libraries**: Standard React hooks (`useState`, `useCallback`, `useMemo`) are used instead of Redux or Zustand.

---

## 5. Getting Started

### Prerequisites
- Node.js version 18.18 or higher (Node 20+ recommended).
- npm (or pnpm / yarn).

### Installation
```bash
git clone <repository-url>
cd simple-todo-app
npm install
```

### Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default `.env.local`:
```env
# REST API URL (Used when NEXT_PUBLIC_DATA_MODE=api)
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Data Mode: "mock" (default for standalone preview) or "api" (connects to live backend)
NEXT_PUBLIC_DATA_MODE=mock
```

### Running Locally
```bash
# Start development server
npm run dev

# Run automated tests
npm run test

# Run linter
npm run lint

# Production build
npm run build
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Switching Between Mock Mode and Real API Mode

The application includes a visible **Mode Indicator** in the header.

| Mode | Configuration | Behavior |
| :--- | :--- | :--- |
| **Mock Mode** | `NEXT_PUBLIC_DATA_MODE=mock` | Uses `MockTaskService`. Realistic sample tasks are loaded and modified in browser `localStorage`. Perfect for UI review before backend development begins. |
| **Real API Mode** | `NEXT_PUBLIC_DATA_MODE=api` | Uses `TaskApiClient`. Every action sends real HTTP requests (`GET`, `POST`, `PATCH`, `DELETE`) to `NEXT_PUBLIC_API_URL`. Never falls back silently to mock data on error. |

To switch modes:
1. Open `.env.local`.
2. Change `NEXT_PUBLIC_DATA_MODE=api`.
3. Restart Next.js dev server (`npm run dev`).

---

## 7. Key Architectural Decisions

1. **Service Interface Abstraction (`TaskService`)**:
   Both `MockTaskService` and `TaskApiClient` implement the identical TypeScript interface. UI components and hooks interact only with `TaskService`, ensuring 100% component portability when switching data sources.
2. **Safe HTTP Client with Error Normalization**:
   The native `fetch` wrapper handles HTTP status codes, empty `204 No Content` responses, malformed JSON, and network dropouts, transforming all failures into a predictable `ApiError` class.
3. **No Premature Optimistic Updates**:
   Mutations update state only after receiving confirmation from the server. This guarantees data consistency and simplifies debugging for learners before introducing rollback patterns.

# Backend Learning Guide — Connecting Frontend to Backend

## Overview & Teaching Philosophy

This guide is designed for **human instructors** teaching backend development to frontend developers who already understand Next.js and React.

Every backend concept in this guide connects directly to an existing feature, component, or file in the **Simple Todo App** frontend.

---

## Curriculum Roadmap

```
Lesson 1: What is a Backend & Why Does the Frontend Need One?
   │
Lesson 2: Client-Server Architecture & The HTTP Protocol
   │
Lesson 3: REST API Design & Mapping Frontend Features to CRUD
   │
Lesson 4: Anatomy of an HTTP Request (URL, Methods, Headers, Body)
   │
Lesson 5: Anatomy of an HTTP Response & Status Codes
   │
Lesson 6: Client-Side vs. Server-Side Validation
   │
Lesson 7: Database Modeling & Data Persistence
   │
Lesson 8: Cross-Origin Resource Sharing (CORS) Demystified
   │
Lesson 9: Step-by-Step Backend Implementation (Node.js/Express)
   │
Lesson 10: Preparing for Authentication & Authorization
```

---

## Lesson 1: What is a Backend & Why Does the Frontend Need One?

### The Frontend Limitation
Right now, in **Mock Mode**, the application uses `localStorage` (`src/lib/api/mockTasks.ts`).
Explain to the student:
- If you open the application in an incognito window or on your phone, your tasks are **not there**.
- If a colleague opens the website, they **cannot see** your tasks.
- If you clear your browser cookies and site data, all tasks are **lost forever**.

### The Four Core Responsibilities of a Backend
1. **Centralized Persistence**: Storing data in a permanent database on a server that survives browser restarts and machine shutdowns.
2. **Single Source of Truth**: Providing synchronized data across multiple devices and concurrent users.
3. **Business Logic & Security**: Enforcing rules that cannot be bypassed by a client (e.g. only task owners can delete tasks; titles cannot be injected with malicious code).
4. **Third-Party Integration**: Communicating with payment processors, email services, and external APIs securely without exposing API secret keys to browser inspection.

---

## Lesson 2: Client-Server Architecture & The HTTP Protocol

### How Frontend and Backend Talk
When a user clicks "Create Task" in the UI:
1. **Client (Frontend)**: Runs inside the user's browser. It constructs an HTTP request packet:
   ```http
   POST /api/v1/tasks HTTP/1.1
   Host: localhost:4000
   Content-Type: application/json

   {"title": "Study backend architecture"}
   ```
2. **Network**: Transmits the request over TCP/IP to port `4000`.
3. **Server (Backend)**: Listens continuously on port `4000`. It receives the raw text, parses the JSON body, verifies the data, writes a record to the database, and returns an HTTP response:
   ```http
   HTTP/1.1 201 Created
   Content-Type: application/json

   {"data": {"id": "task-101", "title": "Study backend architecture", ...}}
   ```
4. **Client Receives Response**: The `request()` function in `src/lib/api/client.ts` unpacks the JSON and calls `setTasks()` to re-render the screen.

---

## Lesson 3: REST API Design & Mapping Frontend Features to CRUD

REST (Representational State Transfer) uses standard HTTP methods to represent Create, Read, Update, and Delete operations on resources.

| Frontend Action | React Hook / Component | HTTP Method | REST Endpoint | Database SQL Equivalent |
| :--- | :--- | :--- | :--- | :--- |
| Initial dashboard load | `loadTasks()` in `useTasks` | `GET` | `/tasks` | `SELECT * FROM tasks ORDER BY created_at DESC;` |
| Search or filter tasks | `setSearchQuery()`, `setStatusFilter()` | `GET` | `/tasks?search=...&status=...` | `SELECT * FROM tasks WHERE title LIKE '%...%' AND status = '...';` |
| Click on a task card | Navigate to `/tasks/[id]` | `GET` | `/tasks/:id` | `SELECT * FROM tasks WHERE id = ? LIMIT 1;` |
| Submit Create Form | `createTask()` in `TaskFormModal` | `POST` | `/tasks` | `INSERT INTO tasks (title, description, status) VALUES (...);` |
| Toggle completed checkbox | `toggleTaskStatus()` in `TaskCard` | `PATCH` | `/tasks/:id` | `UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?;` |
| Submit Edit Form | `updateTask()` in `TaskFormModal` | `PATCH` | `/tasks/:id` | `UPDATE tasks SET title = ?, description = ?, updated_at = ? WHERE id = ?;` |
| Confirm task deletion | `deleteTask()` in `DeleteConfirmDialog` | `DELETE` | `/tasks/:id` | `DELETE FROM tasks WHERE id = ?;` |

### Key Concept: Idempotency
- `GET`, `PUT`, and `DELETE` are **idempotent**: Calling them multiple times with the same input produces the same end state on the server.
- `POST` is **non-idempotent**: Submitting the form three times creates three duplicate tasks in the database! That is why `useTasks.ts` includes `isSubmitting` to disable buttons during in-flight requests.

---

## Lesson 4: Anatomy of an HTTP Request

Explain the three primary ways clients send information to servers:

### 1. Path Parameters (`/tasks/:id`)
- Used to identify a **specific resource**.
- Example: `GET /tasks/task-102`
- In backend routing (e.g. Express): `req.params.id`.

### 2. Query Parameters (`?key=value&key2=value2`)
- Used to **filter, sort, or paginate** collections.
- Example: `GET /tasks?status=pending&sortBy=createdAt&order=desc`
- In backend routing: `req.query.status`, `req.query.sortBy`.

### 3. Request Body (`application/json`)
- Used to transfer complex payloads during `POST` and `PATCH`.
- Example:
  ```json
  {
    "title": "Complete backend roadmap",
    "description": "Read Lessons 1 through 10"
  }
  ```
- In backend routing: `req.body.title`, `req.body.description`.

---

## Lesson 5: HTTP Status Codes & Error Envelopes

The backend communicates outcome via HTTP status codes, not just error messages.

| Status Code | Meaning | When the Backend Should Return It |
| :--- | :--- | :--- |
| **`200 OK`** | Request succeeded | `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id` |
| **`201 Created`** | New resource created | `POST /tasks` |
| **`204 No Content`** | Succeeded with no response body | `DELETE /tasks/:id` |
| **`400 Bad Request`** | Client sent invalid data | Title is empty or too long |
| **`404 Not Found`** | Resource does not exist | Task ID does not match any row in the database |
| **`500 Internal Error`** | Server crashed or database threw error | Unhandled server exception |

### Structured Error Contract
Point students to `src/lib/api/errors.ts`:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted data is invalid.",
    "details": {
      "title": ["Task title cannot be empty."]
    }
  }
}
```
If the backend adheres to this contract, the frontend will automatically render the specific error messages directly beneath the corresponding form inputs.

---

## Lesson 6: Server-Side Validation vs. Client-Side Validation

Show students `src/features/tasks/validation.ts`:
- **Client-Side Validation**: Instant user feedback. Prevents unnecessary network trips.
- **The Golden Rule**: **Never trust the client!**
  Anyone can bypass client validation using Postman, curl, or browser dev tools:
  ```bash
  curl -X POST http://localhost:4000/api/v1/tasks \
       -H "Content-Type: application/json" \
       -d '{"title": ""}'
  ```
- **Backend Responsibility**: The backend must re-validate every single field. If `title` is missing, trimmed to empty, or exceeds 100 characters, return `400 Bad Request`.

---

## Lesson 7: Database Modeling & Persistence

In frontend TypeScript, our task interface is:
```typescript
// src/features/tasks/types.ts
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
}
```

### Relational Database Schema (SQL)
Here is how that model translates directly into a database table (SQLite / PostgreSQL):

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,                       -- e.g. UUID or nanoid
  title VARCHAR(100) NOT NULL,               -- Enforces 1-100 character rule
  description TEXT DEFAULT NULL,             -- Optional text up to 500 characters
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending' or 'completed'
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Mapping Database Columns to API JSON
Database column names often use snake_case (`created_at`), while JavaScript/TypeScript APIs use camelCase (`createdAt`).
The backend serialization layer transforms database rows:
```javascript
function formatTaskResponse(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}
```

---

## Lesson 8: Cross-Origin Resource Sharing (CORS) Demystified

### Why CORS Happens
The frontend runs at `http://localhost:3000`. The backend runs at `http://localhost:4000`.
Because the ports differ, modern browsers block cross-origin HTTP requests unless the server explicitly grants permission.

### How to Fix in Express
```javascript
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"]
}));
```

---

## Lesson 9: Step-by-Step Backend Implementation (Node.js/Express)

Here is a reference backend implementation you can guide students to build from scratch.

### 1. Initialize Backend Project
In a separate folder (e.g., `todo-backend`):
```bash
mkdir todo-backend && cd todo-backend
npm init -y
npm install express cors dotenv
npm install -D nodemon
```

### 2. Create `server.js`
```javascript
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// In-memory array for beginner learning before adding SQLite/PostgreSQL
let tasks = [
  {
    id: "task-1",
    title: "Initial backend test task",
    description: "Successfully connected from Express backend!",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/v1/tasks
app.get("/api/v1/tasks", (req, res) => {
  const { search, status, sortBy, order } = req.query;
  let result = [...tasks];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  }

  if (status) {
    result = result.filter(t => t.status === status);
  }

  res.json({ data: result });
});

// GET /api/v1/tasks/:id
app.get("/api/v1/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({
      error: { code: "TASK_NOT_FOUND", message: `Task "${req.params.id}" not found.` }
    });
  }
  res.json({ data: task });
});

// POST /api/v1/tasks
app.post("/api/v1/tasks", (req, res) => {
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Title is required.",
        details: { title: ["Title cannot be empty."] }
      }
    });
  }

  const now = new Date().toISOString();
  const newTask = {
    id: `task-${crypto.randomUUID()}`,
    title: title.trim(),
    description: description ? description.trim() : null,
    status: "pending",
    createdAt: now,
    updatedAt: now
  };

  tasks.unshift(newTask);
  res.status(201).json({ data: newTask });
});

// PATCH /api/v1/tasks/:id
app.patch("/api/v1/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({
      error: { code: "TASK_NOT_FOUND", message: `Task "${req.params.id}" not found.` }
    });
  }

  const { title, description, status } = req.body;
  const existing = tasks[taskIndex];

  if (title !== undefined && (!title || !title.trim())) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Title cannot be empty.",
        details: { title: ["Title cannot be empty."] }
      }
    });
  }

  const updatedTask = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    description: description !== undefined ? (description ? description.trim() : null) : existing.description,
    status: status !== undefined ? status : existing.status,
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;
  res.json({ data: updatedTask });
});

// DELETE /api/v1/tasks/:id
app.delete("/api/v1/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({
      error: { code: "TASK_NOT_FOUND", message: `Task "${req.params.id}" not found.` }
    });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}/api/v1`);
});
```

---

## Lesson 10: Preparing for Authentication & Authorization

Once students master the basic CRUD cycle, introduce how multi-user support is added:

### 1. Database User Association
Add a `user_id` foreign key column to the `tasks` table:
```sql
ALTER TABLE tasks ADD COLUMN user_id TEXT NOT NULL REFERENCES users(id);
```

### 2. Authorization Header
The frontend will store a JWT token (e.g. in an HTTP-only cookie or memory) and send it with every request:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Server Authentication Middleware
The backend validates the token, extracts the user ID, and restricts all database queries to rows belonging to that user:
```javascript
// Example authentication middleware:
app.get("/api/v1/tasks", authenticateToken, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.user.id);
  res.json({ data: userTasks });
});
```

This completes the learning journey from a static frontend mock to a secure, persistent, full-stack application!

# REST API Contract — Simple Todo App

## 1. Overview & Base Configuration

This document specifies the exact REST API contract that the backend must implement to integrate seamlessly with the frontend.

### Base URL
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```
All routes listed below are relative to this base URL prefix.

### HTTP Conventions
- **Data Exchange**: JSON (`application/json; charset=utf-8`).
- **Dates & Timestamps**: ISO 8601 UTC strings (e.g., `"2026-10-26T12:00:00.000Z"`).
- **Envelopes**: Successful responses are wrapped in a `{ "data": ... }` object. (The frontend also tolerates bare arrays or objects for flexibility).
- **Error Format**: Structured `{ "error": { "code": "...", "message": "...", "details": {...} } }`.

---

## 2. Endpoints Summary

| Method | Endpoint | Purpose | Success Status | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | List all tasks (with optional query filters) | `200 OK` | None |
| `GET` | `/tasks/:id` | Retrieve a single task by ID | `200 OK` | None |
| `POST` | `/tasks` | Create a new task | `201 Created` or `200 OK` | `{ title, description? }` |
| `PATCH` | `/tasks/:id` | Update an existing task partially | `200 OK` | `{ title?, description?, status? }` |
| `DELETE` | `/tasks/:id` | Delete a task permanently | `204 No Content` or `200 OK` | None |

---

## 3. Endpoint Specifications

### 3.1. GET `/tasks` — List Tasks

Retrieves tasks stored in the system.

#### Query Parameters (Optional)
| Parameter | Type | Allowed Values | Description |
| :--- | :--- | :--- | :--- |
| `search` | `string` | Any string | Searches for matches within `title` or `description`. |
| `status` | `string` | `"pending"`, `"completed"` | Filters tasks by completion status. |
| `sortBy` | `string` | `"createdAt"`, `"title"` | Field to sort results by. |
| `order` | `string` | `"asc"`, `"desc"` | Sort direction (default: `"desc"`). |

> **Note on Client vs. Server Filtering**:
> The frontend initially supports fetching all tasks and filtering/sorting them in memory. When the backend implements these query parameters, the frontend can pass them directly in the request.

#### Success Response (`200 OK`)
```json
{
  "data": [
    {
      "id": "task-101",
      "title": "Review REST API contract",
      "description": "Study GET, POST, PATCH, and DELETE endpoints.",
      "status": "pending",
      "createdAt": "2026-10-26T10:00:00.000Z",
      "updatedAt": "2026-10-26T10:00:00.000Z"
    },
    {
      "id": "task-102",
      "title": "Inspect Next.js App Router frontend",
      "description": null,
      "status": "completed",
      "createdAt": "2026-10-26T09:00:00.000Z",
      "updatedAt": "2026-10-26T09:30:00.000Z"
    }
  ]
}
```

---

### 3.2. GET `/tasks/:id` — Retrieve Single Task

Retrieves the task matching the provided `:id` parameter.

#### Path Parameters
- `id` (`string`, required): Unique identifier of the task.

#### Success Response (`200 OK`)
```json
{
  "data": {
    "id": "task-101",
    "title": "Review REST API contract",
    "description": "Study GET, POST, PATCH, and DELETE endpoints.",
    "status": "pending",
    "createdAt": "2026-10-26T10:00:00.000Z",
    "updatedAt": "2026-10-26T10:00:00.000Z"
  }
}
```

#### Error Response (`404 Not Found`)
```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task with ID \"task-999\" was not found."
  }
}
```

---

### 3.3. POST `/tasks` — Create Task

Creates a new task.

#### Request Headers
```http
Content-Type: application/json
Accept: application/json
```

#### Request Body
| Field | Type | Required | Rules |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Yes** | 1 to 100 characters, non-empty, trimmed. |
| `description` | `string` | No | Max 500 characters, can be omitted or `null`. |

Example Request Body:
```json
{
  "title": "Connect SQLite database",
  "description": "Configure SQLite driver and create the tasks table schema."
}
```

#### Success Response (`201 Created` or `200 OK`)
```json
{
  "data": {
    "id": "task-1730000000-123",
    "title": "Connect SQLite database",
    "description": "Configure SQLite driver and create the tasks table schema.",
    "status": "pending",
    "createdAt": "2026-10-26T12:00:00.000Z",
    "updatedAt": "2026-10-26T12:00:00.000Z"
  }
}
```

#### Validation Error Response (`400 Bad Request`)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed: Title is required.",
    "details": {
      "title": ["Task title cannot be empty.", "Must be between 1 and 100 characters."]
    }
  }
}
```

---

### 3.4. PATCH `/tasks/:id` — Update Task

Partially updates an existing task. Fields omitted from the request body remain untouched.

#### Path Parameters
- `id` (`string`, required): Unique identifier of the task.

#### Request Body (All fields optional)
| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | New title (1 to 100 characters, non-empty). |
| `description` | `string \| null` | New description (max 500 chars), or `null` to clear. |
| `status` | `string` | `"pending"` or `"completed"`. |

Example: Toggling status to completed:
```json
{
  "status": "completed"
}
```

Example: Updating title and description:
```json
{
  "title": "Build production Docker container",
  "description": "Use multi-stage Dockerfile for lightweight image."
}
```

#### Success Response (`200 OK`)
```json
{
  "data": {
    "id": "task-101",
    "title": "Build production Docker container",
    "description": "Use multi-stage Dockerfile for lightweight image.",
    "status": "completed",
    "createdAt": "2026-10-26T10:00:00.000Z",
    "updatedAt": "2026-10-26T12:30:00.000Z"
  }
}
```

#### Error Response (`404 Not Found`)
```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task with ID \"task-999\" was not found."
  }
}
```

---

### 3.5. DELETE `/tasks/:id` — Delete Task

Permanently deletes the task matching the provided ID.

#### Path Parameters
- `id` (`string`, required): Unique identifier of the task.

#### Success Response (`204 No Content` or `200 OK`)
- Status: `204 No Content` (Empty body).
- Or `200 OK` with `{ "data": { "success": true } }`.

The frontend HTTP client handles both `204` and `200` without throwing JSON parsing exceptions.

#### Error Response (`404 Not Found`)
```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task with ID \"task-999\" was not found."
  }
}
```

---

## 4. Cross-Origin Resource Sharing (CORS)

Because the frontend runs on `http://localhost:3000` and the backend runs on a different port (such as `http://localhost:4000`), the browser enforces CORS security.

The backend **must** set the following response headers:
```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept, Authorization
```

### Preflight OPTIONS Request
When the frontend issues `POST`, `PATCH`, or `DELETE` requests with `Content-Type: application/json`, browsers automatically send an `OPTIONS` preflight request first.
The backend must respond to `OPTIONS` with `204 No Content` or `200 OK` and the appropriate CORS headers.

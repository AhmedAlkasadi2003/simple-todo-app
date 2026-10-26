# Simple Tasks — Todo App

A modern, responsive, and robust task management application built with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**.

Designed as a production-grade frontend that is immediately usable in local **Mock Mode** and 100% prepared to connect to a custom **REST API backend** built by an instructor.

---

## 🌟 Key Features

- **Full Task Lifecycle**: Create, list, view details (`/tasks/[id]`), edit, toggle completion, and delete with confirmation.
- **Search, Filter & Sort**: Fast client-side searching across titles and descriptions, status filtering (`All`, `Pending`, `Completed`), and sorting by date or title.
- **State Management & UX**: Animated loading skeletons, empty states, button spinners, error banners with retry action, and success notifications.
- **Dual Data Modes**:
  - **Mock Mode**: Fully functional standalone frontend using browser `localStorage` and simulated async delays.
  - **Live API Mode**: Connects directly to any backend REST API adhering to the documented contract.
- **Accessible Design**: Semantic HTML, visible keyboard focus rings, screen-reader labels, and custom SVG icons (no heavy emoji-only controls).
- **Rigorously Tested**: 55 automated unit, integration, and component tests using Vitest and React Testing Library.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```
By default, `NEXT_PUBLIC_DATA_MODE=mock` is active.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Run Test Suite
```bash
npm run test
```

### 5. Check Lint & Production Build
```bash
npm run lint
npm run build
```

---

## 🔌 Switching to a Live Backend

When your backend server is ready:
1. Open `.env.local`
2. Set `NEXT_PUBLIC_DATA_MODE=api`
3. Set `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1` (adjust to your backend port/path)
4. Restart the development server: `npm run dev`

The UI header will update from **Mock Mode** to **Live API** and all requests will hit your backend endpoints.

---

## 📚 Educational Documentation

Comprehensive architectural and backend guides are available in the [`docs/`](./docs) folder:

- 📖 [**Project Overview**](./docs/PROJECT_OVERVIEW.md) — System features, scope boundaries, and core decisions.
- 🏗️ [**Frontend Architecture**](./docs/FRONTEND_ARCHITECTURE.md) — App Router, Server vs. Client components, data flow, and debugging tips.
- 📡 [**REST API Contract**](./docs/API_CONTRACT.md) — Endpoints, HTTP methods, headers, status codes, and request/response examples.
- 🎓 [**Backend Learning Guide**](./docs/BACKEND_LEARNING_GUIDE.md) — 10-lesson pedagogical roadmap for human instructors teaching backend concepts to frontend developers.
- 🧪 [**Testing Guide**](./docs/TESTING_GUIDE.md) — Test suite breakdown, mocking strategies, and quality assurance instructions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/) & [@testing-library/react](https://testing-library.com/)
- **Data Fetching**: Native browser `fetch` with AbortController and custom error normalization

---

## 📄 License
MIT

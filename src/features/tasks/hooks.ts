"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CreateTaskInput,
  Task,
  TaskFilterStatus,
  TaskSortOption,
  TaskSummaryStats,
  UpdateTaskInput,
} from "./types";
import { ApiError, normalizeError } from "@/lib/api/errors";
import { taskService } from "@/lib/api";
import { calculateTaskStats, filterAndSortTasks } from "./utils";

export interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskSummaryStats;
  isLoading: boolean;
  isSubmitting: boolean;
  error: ApiError | null;
  successMessage: string | null;
  searchQuery: string;
  statusFilter: TaskFilterStatus;
  sortBy: TaskSortOption;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: TaskFilterStatus) => void;
  setSortBy: (sort: TaskSortOption) => void;
  clearError: () => void;
  clearSuccessMessage: () => void;
  loadTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task | null>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task | null>;
  toggleTaskStatus: (id: string) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search, filter, and sorting state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<TaskFilterStatus>("all");
  const [sortBy, setSortBy] = useState<TaskSortOption>("createdAt-desc");

  // AbortController ref to cancel in-flight requests when unmounting or reloading
  const activeAbortRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearSuccessMessage = useCallback(() => setSuccessMessage(null), []);

  // Manual reload triggered by user actions (e.g. Retry button)
  const loadTasks = useCallback(async () => {
    if (activeAbortRef.current) {
      activeAbortRef.current.abort();
    }
    const controller = new AbortController();
    activeAbortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const data = await taskService.getTasks(undefined, controller.signal);
      setTasks(data);
    } catch (err: unknown) {
      const normalized = normalizeError(err);
      if (normalized.code !== "REQUEST_ABORTED") {
        setError(normalized);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    activeAbortRef.current = controller;

    taskService
      .getTasks(undefined, controller.signal)
      .then((data) => {
        if (!ignore) {
          setTasks(data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const normalized = normalizeError(err);
          if (normalized.code !== "REQUEST_ABORTED") {
            setError(normalized);
          }
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  // Auto-dismiss success message after 4 seconds
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const createTask = useCallback(
    async (input: CreateTaskInput): Promise<Task | null> => {
      if (isSubmitting) return null;

      setIsSubmitting(true);
      setError(null);

      try {
        const created = await taskService.createTask(input);
        setTasks((prev) => [created, ...prev]);
        setSuccessMessage(`Task "${created.title}" created successfully.`);
        return created;
      } catch (err: unknown) {
        const normalized = normalizeError(err);
        setError(normalized);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting]
  );

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskInput): Promise<Task | null> => {
      if (isSubmitting) return null;

      setIsSubmitting(true);
      setError(null);

      try {
        const updated = await taskService.updateTask(id, input);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        setSuccessMessage(`Task "${updated.title}" updated successfully.`);
        return updated;
      } catch (err: unknown) {
        const normalized = normalizeError(err);
        setError(normalized);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting]
  );

  const toggleTaskStatus = useCallback(
    async (id: string): Promise<Task | null> => {
      const target = tasks.find((t) => t.id === id);
      if (!target) return null;

      const nextStatus = target.status === "completed" ? "pending" : "completed";
      setIsSubmitting(true);
      setError(null);

      try {
        const updated = await taskService.updateTask(id, { status: nextStatus });
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return updated;
      } catch (err: unknown) {
        const normalized = normalizeError(err);
        setError(normalized);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      if (isSubmitting) return false;

      const target = tasks.find((t) => t.id === id);
      setIsSubmitting(true);
      setError(null);

      try {
        await taskService.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setSuccessMessage(
          `Task "${target?.title || id}" was deleted successfully.`
        );
        return true;
      } catch (err: unknown) {
        const normalized = normalizeError(err);
        setError(normalized);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, tasks]
  );

  const filteredTasks = useMemo(() => {
    return filterAndSortTasks(tasks, searchQuery, statusFilter, sortBy);
  }, [tasks, searchQuery, statusFilter, sortBy]);

  const stats = useMemo(() => {
    return calculateTaskStats(tasks);
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    stats,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    searchQuery,
    statusFilter,
    sortBy,
    setSearchQuery,
    setStatusFilter,
    setSortBy,
    clearError,
    clearSuccessMessage,
    loadTasks,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
  };
}

export interface UseTaskReturn {
  task: Task | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: ApiError | null;
  reload: () => Promise<void>;
  update: (input: UpdateTaskInput) => Promise<Task | null>;
  toggleStatus: () => Promise<Task | null>;
}

export function useTask(id: string): UseTaskReturn {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await taskService.getTaskById(id);
      setTask(data);
    } catch (err: unknown) {
      setError(normalizeError(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    taskService
      .getTaskById(id)
      .then((data) => {
        if (!ignore) {
          setTask(data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(normalizeError(err));
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const update = useCallback(
    async (input: UpdateTaskInput): Promise<Task | null> => {
      if (!id || isSubmitting) return null;
      setIsSubmitting(true);
      setError(null);

      try {
        const updated = await taskService.updateTask(id, input);
        setTask(updated);
        return updated;
      } catch (err: unknown) {
        setError(normalizeError(err));
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [id, isSubmitting]
  );

  const toggleStatus = useCallback(async (): Promise<Task | null> => {
    if (!task) return null;
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    return update({ status: nextStatus });
  }, [task, update]);

  return {
    task,
    isLoading,
    isSubmitting,
    error,
    reload: load,
    update,
    toggleStatus,
  };
}

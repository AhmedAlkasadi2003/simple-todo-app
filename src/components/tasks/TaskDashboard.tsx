"use client";

import React, { useState } from "react";
import { CreateTaskInput, Task, UpdateTaskInput } from "@/features/tasks/types";
import { useTasks } from "@/features/tasks/hooks";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { TaskStats } from "./TaskStats";
import { TaskControls } from "./TaskControls";
import { TaskList } from "./TaskList";
import { Alert } from "../ui/Alert";
import { TaskFormModal } from "../forms/TaskFormModal";
import { DeleteConfirmDialog } from "../forms/DeleteConfirmDialog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function TaskDashboard() {
  const { t } = useLanguage();
  const {
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
  } = useTasks();

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Form submit handler (handles both create and edit)
  const handleFormSubmit = async (
    input: CreateTaskInput | UpdateTaskInput
  ): Promise<boolean> => {
    if (taskToEdit) {
      const updated = await updateTask(taskToEdit.id, input);
      if (updated) {
        setTaskToEdit(null);
        return true;
      }
      return false;
    } else {
      const created = await createTask(input as CreateTaskInput);
      if (created) {
        setIsCreateModalOpen(false);
        return true;
      }
      return false;
    }
  };

  // Delete confirmation handler
  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    const success = await deleteTask(taskToDelete.id);
    if (success) {
      setTaskToDelete(null);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("createdAt-desc");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <Header onCreateClick={() => setIsCreateModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Intro Subtitle & Overview */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.app.dashboardTitle}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t.app.dashboardSubtitle}
          </p>
        </div>

        {/* Global Notifications: Success Banner */}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onDismiss={clearSuccessMessage}
          />
        )}

        {/* Global Notifications: Error Alert with Retry */}
        {error && (
          <Alert
            type="error"
            title={error.code ? `Error (${error.code})` : "Operation Failed"}
            message={error.message}
            details={error.details}
            onRetry={loadTasks}
            onDismiss={clearError}
          />
        )}

        {/* Task Summary Metrics */}
        <section aria-label="Task metrics summary">
          <TaskStats
            stats={stats}
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </section>

        {/* Task Search, Filters, and Sorting Controls */}
        <section aria-label="Task controls and filters">
          <TaskControls
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            sortBy={sortBy}
            stats={stats}
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            onSortChange={setSortBy}
          />
        </section>

        {/* Task Cards Feed */}
        <section aria-label="Task list items">
          <TaskList
            tasks={filteredTasks}
            totalCount={tasks.length}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            searchQuery={searchQuery}
            onToggleStatus={toggleTaskStatus}
            onEdit={(task) => setTaskToEdit(task)}
            onDelete={(task) => setTaskToDelete(task)}
            onCreateNew={() => setIsCreateModalOpen(true)}
            onClearFilters={handleClearFilters}
          />
        </section>
      </main>

      {/* Create / Edit Task Modal */}
      <TaskFormModal
        isOpen={isCreateModalOpen || Boolean(taskToEdit)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

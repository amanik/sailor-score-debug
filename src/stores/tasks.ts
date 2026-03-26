import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ──────────────────────────────────────────────────

export interface ManualTask {
  readonly id: string;
  readonly title: string;
  readonly createdAt: string;
}

interface TasksState {
  /** IDs of completed tasks (both auto-generated and manual) */
  readonly completedIds: readonly string[];
  /** User-created tasks */
  readonly manualTasks: readonly ManualTask[];
}

interface TasksActions {
  readonly toggleComplete: (id: string) => void;
  readonly addManualTask: (title: string) => void;
  readonly removeManualTask: (id: string) => void;
  readonly clearCompleted: () => void;
}

// ─── Store ──────────────────────────────────────────────────

export const useTasksStore = create<TasksState & TasksActions>()(
  persist(
    (set) => ({
      completedIds: [],
      manualTasks: [],

      toggleComplete: (id) =>
        set((state) => {
          const isCompleted = state.completedIds.includes(id);
          return {
            completedIds: isCompleted
              ? state.completedIds.filter((cid) => cid !== id)
              : [...state.completedIds, id],
          };
        }),

      addManualTask: (title) =>
        set((state) => ({
          manualTasks: [
            ...state.manualTasks,
            {
              id: `manual-${crypto.randomUUID()}`,
              title: title.trim(),
              createdAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      removeManualTask: (id) =>
        set((state) => ({
          manualTasks: state.manualTasks.filter((t) => t.id !== id),
          completedIds: state.completedIds.filter((cid) => cid !== id),
        })),

      clearCompleted: () =>
        set((state) => {
          const completedManualIds = state.manualTasks
            .filter((t) => state.completedIds.includes(t.id))
            .map((t) => t.id);
          return {
            completedIds: [],
            manualTasks: state.manualTasks.filter(
              (t) => !completedManualIds.includes(t.id)
            ),
          };
        }),
    }),
    { name: "sailor-tasks" }
  )
);

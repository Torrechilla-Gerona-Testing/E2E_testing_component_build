import { Task } from "@/generated/prisma";
import { SortDirection } from "@/types/Task";

// Helper to apply sorting logic
const applySort = (
  tasksToSort: Task[],
  direction: SortDirection,
  compareFn: (a: Task, b: Task) => number
): Task[] => {
  if (direction === "none") return [...tasksToSort];

  const copyTasks = [...tasksToSort];
  copyTasks.sort((a, b) => {
    const comparisonResult = compareFn(a, b);
    return direction === "desc" ? -comparisonResult : comparisonResult;
  });
  return copyTasks;
};

// Sort tasks by name
const sortByName = (tasksToSort: Task[], direction: SortDirection): Task[] => {
  return applySort(tasksToSort, direction, (a, b) =>
    a.title.localeCompare(b.title)
  );
};

// Improved due date sorting
const sortByDueDate = (
  tasksToSort: Task[],
  direction: SortDirection
): Task[] => {
  return applySort(tasksToSort, direction, (a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    try {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    } catch {
      return 0;
    }
  });
};

// Sort by completion status
const sortByCompletion = (
  tasksToSort: Task[],
  direction: SortDirection
): Task[] => {
  return applySort(
    tasksToSort,
    direction,
    (a, b) => Number(b.completed) - Number(a.completed)
  );
};

export const TaskSortingStrategy = {
  sortByName,
  sortByDueDate,
  sortByCompletion,
};

export type TaskSortProperty = "name" | "dueDate" | "completion";

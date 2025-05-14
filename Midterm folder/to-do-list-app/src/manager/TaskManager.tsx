import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  readTask,
} from "@/actions/TaskActions";
import { Task } from "@/generated/prisma";
import { SortDirection, TaskSortProperty } from "@/types/Task";
import { TaskSortingStrategy } from "@/Sort/SortStartegy";

const applySorting = (
  tasksToSort: Task[],
  property: TaskSortProperty,
  direction: SortDirection
): Task[] => {
  if (property === "none" || direction === "none") return [...tasksToSort];

  const strategy = {
    name: TaskSortingStrategy.sortByName,
    dueDate: TaskSortingStrategy.sortByDueDate,
    completion: TaskSortingStrategy.sortByCompletion,
  }[property];

  return strategy ? strategy(tasksToSort, direction) : [...tasksToSort];
};

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [sortProperty, setSortProperty] = useState<TaskSortProperty>("none");

  const tasksAmount = useMemo(() => tasks.length, [tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const loadedTasks = await readTask();
        setTasks(applySorting(loadedTasks, sortProperty, sortDirection));
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        // Optionally handle error state here
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [sortDirection, sortProperty]);

  const sortAndSetTasks = useCallback(
    (newTasks: Task[]) => {
      const sorted = applySorting(newTasks, sortProperty, sortDirection);
      setTasks(sorted);
    },
    [sortProperty, sortDirection]
  );

  const setSortCriteria = useCallback(
    (property: TaskSortProperty, direction: SortDirection) => {
      setSortProperty(property);
      setSortDirection(direction);
      // No need to sort here as it will trigger the useEffect
    },
    []
  );

  const insert = useCallback(
    async (task: Omit<Task, "id">) => {
      setLoading(true);
      try {
        const newTask = await createTask(task);
        sortAndSetTasks([...tasks, newTask]);
        return newTask; // Return the created task
      } catch (error) {
        console.error("Failed to create task:", error);
        throw error; // Re-throw for error handling in components
      } finally {
        setLoading(false);
      }
    },
    [tasks, sortAndSetTasks]
  );

  const edit = useCallback(
    async (task: Task) => {
      setLoading(true);
      try {
        const updated = await updateTask(task.id, task);
        const updatedTasks = tasks.map((t) =>
          t.id === updated.id ? updated : t
        );
        sortAndSetTasks(updatedTasks);
        return updated; // Return the updated task
      } catch (error) {
        console.error("Failed to update task:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [tasks, sortAndSetTasks]
  );

  const remove = useCallback(
    async (taskId: string) => {
      setLoading(true);
      try {
        const deleted = await deleteTask(taskId);
        const filtered = tasks.filter((t) => t.id !== deleted.id);
        sortAndSetTasks(filtered);
        return deleted; // Return the deleted task
      } catch (error) {
        console.error("Failed to delete task:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [tasks, sortAndSetTasks]
  );

  const toggleComplete = useCallback(
    async (task: Task) => {
      setLoading(true);
      try {
        const updated = await completeTask(task.id);
        const updatedTasks = tasks.map((t) =>
          t.id === updated.id ? updated : t
        );
        sortAndSetTasks(updatedTasks);
        return updated; // Return the completed task
      } catch (error) {
        console.error("Failed to complete task:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [tasks, sortAndSetTasks]
  );

  return {
    tasks,
    tasksAmount,
    loading,
    sortDirection,
    sortProperty,
    setTasks: sortAndSetTasks,
    setLoading,
    setSortCriteria,
    createTask: insert,
    updateTask: edit,
    deleteTask: remove,
    triggerCompleteTask: toggleComplete,
  };
}

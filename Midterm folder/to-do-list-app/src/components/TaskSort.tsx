"use client";
import { Task } from "@/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskSortingStrategy } from "@/Sort/SortStartegy";
import { SortDirection, TaskSortProperty } from "@/types/Task";

type SortOption = {
  value: string;
  label: string;
  property: TaskSortProperty;
  direction: SortDirection;
};

const SORT_OPTIONS: SortOption[] = [
  {
    value: "none",
    label: "Default Order",
    property: "none",
    direction: "none",
  },
  {
    value: "name-asc",
    label: "Name (A-Z)",
    property: "name",
    direction: "asc",
  },
  {
    value: "name-desc",
    label: "Name (Z-A)",
    property: "name",
    direction: "desc",
  },
  {
    value: "date-asc",
    label: "Due Date (Earliest)",
    property: "dueDate",
    direction: "asc",
  },
  {
    value: "date-desc",
    label: "Due Date (Latest)",
    property: "dueDate",
    direction: "desc",
  },
  {
    value: "completed",
    label: "Completed First",
    property: "none",
    direction: "none",
  },
];

type SortProps = {
  tasks: Task[];
  onSort: (sortedTasks: Task[]) => void;
};

const TaskSort: React.FC<SortProps> = ({ tasks, onSort }) => {
  const handleSort = (sortValue: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === sortValue);
    if (!option) return;

    let sortedTasks = [...tasks];

    // Special case for completed tasks
    if (sortValue === "completed") {
      sortedTasks.sort((a, b) => Number(b.completed) - Number(a.completed));
    }
    // Use sorting strategy for other cases
    else if (option.property !== "none") {
      switch (option.property) {
        case "name":
          sortedTasks = TaskSortingStrategy.sortByName(
            sortedTasks,
            option.direction
          );
          break;
        case "dueDate":
          sortedTasks = TaskSortingStrategy.sortByDueDate(
            sortedTasks,
            option.direction
          );
          break;
        case "completion":
          sortedTasks = TaskSortingStrategy.sortByCompletion(
            sortedTasks,
            option.direction
          );
          break;
      }
    }

    onSort(sortedTasks);
  };

  return (
    <Select onValueChange={handleSort}>
      <SelectTrigger className="min-w-[200px] bg-white">
        <SelectValue placeholder="Sort tasks by..." />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskSort;

import { Task } from "@/generated/prisma";
import { formatDate } from "date-fns";
import { Bell, Check, Pencil, Trash } from "lucide-react";

type taskType = "basic" | "timed" | "no-description" | "checklist";

type TaskFactoryProps = {
  type: taskType;
  task: Task;
  onUpdate: (task: Task) => void; // Update type to match usage
  onDelete: (task: Task) => void; // Update type to match usage
  onComplete: (taskId: string) => Promise<void>;
};

const TaskFactory = ({
  type,
  task,
  onUpdate,
  onDelete,
  onComplete,
}: TaskFactoryProps) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      className={`relative flex flex-col lg:gap-2 p-4 w-full  border gap-4 rounded-lg shadow-md ${
        isOverdue ? "bg-red-300/50" : ""
      } ${task.completed ? "bg-green-300/50" : ""}`}
    >
      {/* Show bell icon only for timed tasks */}
      {type === "timed" && task.dueDate && (
        <div className="absolute top-4 right-4">
          <Bell size={15} color="grey" />
        </div>
      )}
      {/* Title */}
      <h2
        className={`${
          !task.description ? "h-full flex items-center justify-center" : ""
        }`}
        data-testid="task-title"
      >
        {task.title}
      </h2>
      {/* Description */}
      {task.description && type !== "no-description" && (
        <div className="flex h-full">{task.description}</div>
      )}
      {/* Footer */}
      <div className="flex gap-8 justify-around items-end">
        <span className="w-full">
          {task.dueDate && (
            <div>
              <span className="text-sm text-neutral-600">
                Due: {formatDate(new Date(task.dueDate), "PPp")}
              </span>
              {isOverdue && !task.completed && (
                <span className="text-red-500 text-sm ml-2">Overdue</span>
              )}
            </div>
          )}
        </span>
        <div className="gap-2 items-end w-min flex flex-col lg:flex-row">
          <button onClick={() => onUpdate(task)} data-testid="edit-test">
            {" "}
            {/* Update handler */}
            <Pencil size={18} />
          </button>
          <button onClick={() => onDelete(task)} data-testid="delete-test">
            {" "}
            {/* Update handler */}
            <Trash size={18} />
          </button>
          {type === "basic" && (
            <button onClick={() => onComplete(task.id)}>
              <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFactory;

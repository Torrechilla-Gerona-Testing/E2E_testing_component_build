"use client";
import { Task } from "@/generated/prisma";
import TaskFactory from "./TaskFactory";
import { useEffect, useState } from "react";
import { Sheet } from "./ui/sheet";
import EditTaskForm from "@/components/EditTaskForm";
import { Dialog } from "./ui/dialog";
import DeleteTaskForm from "@/components/DeleteTaskForm";
import { useTaskManager } from "@/manager/TaskManager";
import TaskSort from "@/components/TaskSort";
import { toast } from "sonner";

interface TaskListProps {
  initialTasks: Task[];
}

const TaskList = ({ initialTasks }: TaskListProps) => {
  const {
    tasks,
    triggerCompleteTask: completeTask,
    setTasks,
  } = useTaskManager();

  // Initialize tasks with initialTasks
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks, setTasks]);

  // For editing
  const [currentEditingTask, setCurrentEditingTask] = useState<Task | null>(
    null
  );
  const [openEditSheet, setOpenEditSheet] = useState(false);

  const handleEditTask = (task: Task) => {
    setCurrentEditingTask(task);
    setOpenEditSheet(true);
  };

  // For deleting
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentDeletingTask, setCurrentDeletingTask] = useState<Task | null>(
    null
  );

  const handleDeleteTask = (task: Task) => {
    setCurrentDeletingTask(task);
    setOpenDeleteDialog(true);
  };

  // Check for overdue tasks and trigger notification
  useEffect(() => {
    if (tasks.length > 0) {
      const overdueTasksNumber = tasks.reduce((acc, task) => {
        if (
          task.dueDate &&
          new Date(task.dueDate) < new Date() &&
          !task.completed
        ) {
          return acc + 1;
        }
        return acc;
      }, 0);
      if (overdueTasksNumber > 0) {
        toast.error(`You have ${overdueTasksNumber} overdue task(s)!`);
      }
    }
  }, [tasks]);

  const handleComplete = async (taskId: string) => {
    await completeTask({ id: taskId } as Task);
  };

  const handleSort = (sortedTasks: Task[]) => {
    setTasks(sortedTasks);
  };

  return (
    <>
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
          {/* Delete Dialog */}
          {openDeleteDialog && currentDeletingTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <DeleteTaskForm
                  closeDialog={() => {
                    setOpenDeleteDialog(false);
                    setCurrentDeletingTask(null);
                  }}
                  task={currentDeletingTask}
                />
              </div>
            </div>
          )}

          {/* Edit Sheet */}
          {openEditSheet && currentEditingTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <EditTaskForm
                  task={currentEditingTask}
                  closeSheet={() => {
                    setOpenEditSheet(false);
                    setCurrentEditingTask(null);
                  }}
                />
              </div>
            </div>
          )}

          <div className="w-full bg-transparent h-full justify-center flex flex-col">
            {/* Add TaskSort component here */}
            <div className="flex justify-end mb-4">
              <TaskSort tasks={tasks} onSort={handleSort} />
            </div>

            <div className="flex flex-col gap-2 w-full self-center">
              {tasks?.map((task) => (
                <div key={task.id}>
                  {!task.description ? (
                    <TaskFactory
                      task={task}
                      type="no-description"
                      onUpdate={handleEditTask}
                      onDelete={handleDeleteTask}
                      onComplete={handleComplete}
                    />
                  ) : task.dueDate ? (
                    <TaskFactory
                      task={task}
                      type="timed"
                      onUpdate={handleEditTask}
                      onDelete={handleDeleteTask}
                      onComplete={handleComplete}
                    />
                  ) : (
                    <TaskFactory
                      task={task}
                      type="basic"
                      onUpdate={handleEditTask}
                      onDelete={handleDeleteTask}
                      onComplete={handleComplete}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Sheet>
      </Dialog>
    </>
  );
};

export default TaskList;

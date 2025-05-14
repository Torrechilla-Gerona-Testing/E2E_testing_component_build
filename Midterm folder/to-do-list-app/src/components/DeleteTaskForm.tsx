"use client";

import { Task } from "@/generated/prisma";
import { useTaskManager } from "@/manager/TaskManager";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

interface DeleteTaskFormProps {
  task: Task | null;
  closeDialog: () => void;
}

function DeleteTaskForm({ task, closeDialog }: DeleteTaskFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTask } = useTaskManager();
  const router = useRouter();
  const handleDelete = async () => {
    if (!task) return;

    try {
      setIsDeleting(true);
      await deleteTask(task.id);
      closeDialog();
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!task) return null;

  return (
    <div className="p-4 bg-white">
      <DialogHeader className="mb-4">
        <DialogTitle>Delete Task</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete &quot;{task.title}&quot;? This action
          cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={closeDialog}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Task"}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default DeleteTaskForm;

"use server";
import { Task } from "@/generated/prisma";
import prisma from "@/lib/prisma";
type CreateTaskInput = {
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: Date | null;
};

export async function createTask(task: CreateTaskInput): Promise<Task> {
  return await prisma.task.create({
    data: task,
  });
}

export async function updateTask(taskId: string, task: Partial<Task>) {
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: task,
  });
  return updatedTask;
}

export async function deleteTask(taskId: string) {
  return await prisma.task.delete({
    where: { id: taskId },
  });
}

export async function completeTask(taskId: string) {
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { completed: true },
  });
  return updatedTask;
}

export async function readTask() {
  const task = await prisma.task.findMany();
  return task;
}

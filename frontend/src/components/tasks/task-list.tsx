"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FrontendTask } from "@/types/task";
import { tasksService } from "@/lib/api/tasks";
import { TaskItem } from "./task-item";

interface TaskListProps {
  refreshTrigger?: number;
}

export function TaskList({ refreshTrigger }: TaskListProps) {
  const [tasks, setTasks] = useState<FrontendTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await tasksService.getTasks();
      setTasks(fetchedTasks);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const handleToggleStatus = async (
    id: number,
    newStatus: "Todo" | "InProgress" | "Done"
  ) => {
    const previousTasks = [...tasks];
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );

    try {
      await tasksService.updateTask(id, { status: newStatus });
      toast.success("Task status updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update task status");
      setTasks(previousTasks);
    }
  };

  const handleUpdateTask = async (
    id: number,
    data: { title?: string; description?: string }
  ) => {
    const previousTasks = [...tasks];
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...data } : task))
    );

    try {
      await tasksService.updateTask(id, data);
      toast.success("Task updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update task");
      setTasks(previousTasks);
    }
  };

  const handleDeleteTask = async (id: number) => {
    const previousTasks = [...tasks];
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    try {
      await tasksService.deleteTask(id);
      toast.success("Task deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete task");
      setTasks(previousTasks);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === "Todo");
  const inProgressTasks = tasks.filter((t) => t.status === "InProgress");
  const doneTasks = tasks.filter((t) => t.status === "Done");

  return (
    <div className="space-y-6">
      {todoTasks.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-3">TO DO ({todoTasks.length})</h3>
          <div className="space-y-3">
            {todoTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            ))}
          </div>
        </div>
      )}

      {inProgressTasks.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-3">IN PROGRESS ({inProgressTasks.length})</h3>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            ))}
          </div>
        </div>
      )}

      {doneTasks.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-3">DONE ({doneTasks.length})</h3>
          <div className="space-y-3">
            {doneTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

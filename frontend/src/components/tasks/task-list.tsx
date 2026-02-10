"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    newStatus: "pending" | "in_progress" | "completed"
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
      <div className="flex items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-4 border-t-4 border-cyan-400 mx-auto mb-4"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-base text-white font-bold"
          >
            Loading tasks...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 border-2 border-dashed border-white/30 rounded-2xl bg-white/5 backdrop-blur-sm"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          📝
        </motion.div>
        <p className="text-white font-bold text-lg">No tasks yet. Create your first task to get started!</p>
        <p className="text-purple-200 text-sm mt-2">Your productivity journey begins here ⚡</p>
      </motion.div>
    );
  }

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {todoTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.h3
              className="font-black text-base text-white mb-4 flex items-center gap-2 bg-gradient-to-r from-slate-500 to-gray-600 px-4 py-2 rounded-lg shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              📋 TO DO ({todoTasks.length})
            </motion.h3>
            <div className="space-y-4">
              <AnimatePresence>
                {todoTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskItem
                      task={task}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteTask}
                      onUpdate={handleUpdateTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {inProgressTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.h3
              className="font-black text-base text-white mb-4 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg shadow-lg"
              whileHover={{ scale: 1.02 }}
              animate={{ boxShadow: ["0 0 20px rgba(34, 211, 238, 0.3)", "0 0 40px rgba(34, 211, 238, 0.6)", "0 0 20px rgba(34, 211, 238, 0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚡ IN PROGRESS ({inProgressTasks.length})
            </motion.h3>
            <div className="space-y-4">
              <AnimatePresence>
                {inProgressTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskItem
                      task={task}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteTask}
                      onUpdate={handleUpdateTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {doneTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.h3
              className="font-black text-base text-white mb-4 flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-lg shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              ✅ DONE ({doneTasks.length})
            </motion.h3>
            <div className="space-y-4">
              <AnimatePresence>
                {doneTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskItem
                      task={task}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteTask}
                      onUpdate={handleUpdateTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

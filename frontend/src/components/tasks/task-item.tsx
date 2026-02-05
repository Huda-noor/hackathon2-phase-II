"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FrontendTask } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Check, X, Circle, CircleDot, CheckCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface TaskItemProps {
  task: FrontendTask;
  onToggleStatus: (id: number, status: "Todo" | "InProgress" | "Done") => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: { title?: string; description?: string }) => void;
}

export function TaskItem({ task, onToggleStatus, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");

  const handleStatusClick = () => {
    let newStatus: "Todo" | "InProgress" | "Done";
    if (task.status === "Todo") {
      newStatus = "InProgress";
    } else if (task.status === "InProgress") {
      newStatus = "Done";
    } else {
      newStatus = "Todo";
    }
    onToggleStatus(task.id, newStatus);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
  };

  const statusConfig = {
    Todo: {
      icon: Circle,
      badge: "todo",
      label: "To Do",
      gradient: "from-slate-100/90 via-gray-100/90 to-slate-200/90",
      border: "border-l-slate-400",
      iconColor: "text-slate-500",
      bg: "bg-white/60"
    },
    InProgress: {
      icon: Zap,
      badge: "inProgress",
      label: "In Progress",
      gradient: "from-cyan-100/90 via-blue-100/90 to-purple-100/90",
      border: "border-l-cyan-500",
      iconColor: "text-blue-600",
      bg: "bg-gradient-to-r from-cyan-50/60 to-blue-50/60"
    },
    Done: {
      icon: CheckCircle,
      badge: "done",
      label: "Done",
      gradient: "from-green-100/90 via-emerald-100/90 to-teal-100/90",
      border: "border-l-green-500",
      iconColor: "text-green-600",
      bg: "bg-white/60"
    },
  };

  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card className="p-5 border-0 shadow-2xl bg-white/90 backdrop-blur-md space-y-4 border-2 border-purple-300">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            className="font-semibold text-lg"
            autoFocus
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Task description (optional)"
            rows={3}
          />
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="w-full border-2 hover:bg-gray-100 font-semibold"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "group relative p-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-md border-l-4 overflow-hidden",
          config.bg,
          config.border,
          task.status === "Done" && "opacity-75"
        )}
      >
        {/* Electric Effect for In Progress */}
        {task.status === "InProgress" && (
          <motion.div
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 pointer-events-none"
          />
        )}

        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="flex-1 space-y-3">
            {/* Header with status */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleStatusClick}
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="transition-transform"
              >
                <StatusIcon
                  className={cn(
                    "h-7 w-7 drop-shadow-md",
                    config.iconColor
                  )}
                />
              </motion.button>
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-bold text-xl text-gray-900 drop-shadow-sm",
                    task.status === "Done" && "line-through text-gray-500"
                  )}
                >
                  {task.title}
                </h3>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2"
                >
                  <Badge
                    variant={task.status === "Todo" ? "todo" : task.status === "InProgress" ? "inProgress" : "done"}
                    className="font-semibold shadow-sm"
                  >
                    {config.label}
                  </Badge>
                </motion.div>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-800 pl-11 leading-relaxed font-medium"
              >
                {task.description}
              </motion.p>
            )}

            {/* Footer metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-600 pl-11 font-semibold">
              <span>📅 {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              {task.updated_at && (
                <span>• ✏️ {new Date(task.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0, x: 0 }}
            whileHover={{ opacity: 1 }}
            className="flex flex-col gap-2 group-hover:opacity-100 transition-opacity"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-10 w-10 bg-blue-500/20 hover:bg-blue-500/40 backdrop-blur-sm shadow-md"
                title="Edit task"
              >
                <Edit2 className="h-5 w-5 text-blue-700" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
                className="h-10 w-10 bg-red-500/20 hover:bg-red-500/40 text-red-600 hover:text-red-700 backdrop-blur-sm shadow-md"
                title="Delete task"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

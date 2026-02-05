"use client";

import { useState } from "react";
import { FrontendTask } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Check, X, Circle, CircleDot, CheckCircle } from "lucide-react";
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
      gradient: "from-gray-50 to-gray-100",
      border: "border-l-gray-400"
    },
    InProgress: {
      icon: CircleDot,
      badge: "inProgress",
      label: "In Progress",
      gradient: "from-blue-50 to-blue-100",
      border: "border-l-blue-400"
    },
    Done: {
      icon: CheckCircle,
      badge: "done",
      label: "Done",
      gradient: "from-green-50 to-green-100",
      border: "border-l-green-400"
    },
  };

  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  if (isEditing) {
    return (
      <Card className="p-4 border-0 shadow-md bg-white space-y-3">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title"
          className="font-medium text-lg"
        />
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Task description (optional)"
          rows={3}
          className="resize-none"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSaveEdit}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancelEdit}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group p-5 border-0 shadow-md hover:shadow-xl transition-all duration-200 bg-gradient-to-r border-l-4",
        config.gradient,
        config.border,
        task.status === "Done" && "opacity-80"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Header with status */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStatusClick}
              className="transition-transform hover:scale-110"
            >
              <StatusIcon
                className={cn(
                  "h-6 w-6",
                  task.status === "Todo" && "text-gray-500",
                  task.status === "InProgress" && "text-blue-500",
                  task.status === "Done" && "text-green-500"
                )}
              />
            </button>
            <div className="flex-1">
              <h3
                className={cn(
                  "font-bold text-lg text-gray-900",
                  task.status === "Done" && "line-through text-gray-500"
                )}
              >
                {task.title}
              </h3>
              <Badge variant={task.status === "Todo" ? "todo" : task.status === "InProgress" ? "inProgress" : "done"} className="mt-1">
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-700 pl-9 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Footer metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pl-9">
            <span>Created {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {task.updated_at && (
              <span>• Updated {new Date(task.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-9 w-9 hover:bg-white/80"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50/80"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

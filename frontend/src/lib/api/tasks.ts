// frontend/src/lib/api/tasks.ts
import { TaskCreateDTO, TaskUpdateDTO } from "@/lib/validations/task";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";
import { FrontendTask } from "@/types/task";

type TaskCreatePayload = z.infer<typeof TaskCreateDTO>;
type TaskUpdatePayload = z.infer<typeof TaskUpdateDTO>;

export const tasksService = {
  async getTasks(): Promise<FrontendTask[]> {
    return apiClient.get<FrontendTask[]>("/tasks");
  },

  async createTask(taskData: TaskCreatePayload): Promise<FrontendTask> {
    return apiClient.post<FrontendTask>("/tasks", taskData);
  },

  async updateTask(id: number, taskData: TaskUpdatePayload): Promise<FrontendTask> {
    return apiClient.patch<FrontendTask>(`/tasks/${id}`, taskData);
  },

  async deleteTask(id: number): Promise<void> {
    return apiClient.delete<void>(`/tasks/${id}`);
  },
};
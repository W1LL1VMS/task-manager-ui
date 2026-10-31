import { api } from "./client.js";

export async function fetchTasks() {
  const { data } = await api.get("/tasks");
  return data.tasks;
}

export async function fetchAllTasksAdmin() {
  const { data } = await api.get("/tasks/admin/all");
  return data.tasks;
}

export async function createTask(payload) {
  const { data } = await api.post("/tasks", payload);
  return data.task;
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.task;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}
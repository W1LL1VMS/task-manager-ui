import { useCallback, useEffect, useState } from "react";
import * as tasksApi from "../api/tasks.js";
import { getErrorMessage } from "../api/errors.js";

export function useTaskList(fetcher) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }, []);

  const addTask = useCallback(async (data) => {
    const task = await tasksApi.createTask(data);
    setTasks((list) => [task, ...list]);
  }, []);

  const editTask = useCallback(async (id, data) => {
    const task = await tasksApi.updateTask(id, data);
    setTasks((list) => list.map((t) => (t.id === id ? task : t)));
  }, []);

  const removeTask = useCallback(async (id) => {
    await tasksApi.deleteTask(id);
    setTasks((list) => list.filter((t) => t.id !== id));
  }, []);

  return { tasks, loading, error, reload, addTask, editTask, removeTask };
}
import { useCallback, useMemo, useState } from "react";
import AppShell from "../components/AppShell.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import { fetchTasks } from "../api/tasks.js";
import { useTaskList } from "../hooks/useTaskList.js";
import { STATUSES } from "../lib/status.js";

const FILTERS = [{ value: "ALL", label: "Toutes" }, ...STATUSES];

const primaryButton =
  "rounded-xl bg-linear-to-r from-neon-cyan to-neon-violet px-5 py-2.5 font-mono text-sm font-medium text-ink-950 transition hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(0,229,199,0.3)]";

export default function DashboardPage() {
  const { tasks, loading, error, reload, addTask, editTask, removeTask } = useTaskList(fetchTasks);
  const [filter, setFilter] = useState("ALL");
  // null = fenêtre fermée, { task: null } = création, { task } = modification
  const [modal, setModal] = useState(null);

  const counts = useMemo(() => {
    const result = { ALL: tasks.length, TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    for (const task of tasks) result[task.status] += 1;
    return result;
  }, [tasks]);

  const visibleTasks = filter === "ALL" ? tasks : tasks.filter((task) => task.status === filter);
  const progress = counts.ALL === 0 ? 0 : Math.round((counts.DONE / counts.ALL) * 100);

  const closeModal = useCallback(() => setModal(null), []);

  const handleModalSubmit = (values) => {
    if (modal.task) {
      return editTask(modal.task.id, values);
    }
    const payload = { title: values.title };
    if (values.description) payload.description = values.description;
    return addTask(payload);
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-neon-cyan">// tableau de bord</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Mes tâches</h1>
        </div>
        <button type="button" onClick={() => setModal({ task: null })} className={primaryButton}>
          + Nouvelle tâche
        </button>
      </div>

      {counts.ALL > 0 && (
        <div className="mt-8">
          <div className="mb-2 flex justify-between font-mono text-xs text-slate-400">
            <span>Progression</span>
            <span>{progress} %</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-linear-to-r from-neon-cyan to-neon-violet transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs transition ${
              filter === item.value
                ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-100"
            }`}
          >
            {item.label} <span className="ml-1 opacity-70">{counts[item.value]}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading &&
          [0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-sm text-red-200"
          >
            <p>{error}</p>
            <button type="button" onClick={reload} className="mt-3 font-mono text-xs underline">
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && counts.ALL === 0 && (
          <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center">
            <p className="font-display text-xl font-semibold">Aucune tâche pour l'instant</p>
            <p className="mt-2 text-sm text-slate-400">Créez votre première tâche pour démarrer.</p>
            <button
              type="button"
              onClick={() => setModal({ task: null })}
              className={`mt-6 ${primaryButton}`}
            >
              + Nouvelle tâche
            </button>
          </div>
        )}

        {!loading && !error && counts.ALL > 0 && visibleTasks.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">Aucune tâche dans cette catégorie.</p>
        )}

        {!loading &&
          !error &&
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={(id, status) => editTask(id, { status })}
              onEdit={(selected) => setModal({ task: selected })}
              onDelete={removeTask}
            />
          ))}
      </div>

      {modal && (
        <TaskModal task={modal.task} onClose={closeModal} onSubmit={handleModalSubmit} />
      )}
    </AppShell>
  );
}
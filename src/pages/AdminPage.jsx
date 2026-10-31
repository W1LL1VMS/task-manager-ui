import { useMemo } from "react";
import AppShell from "../components/AppShell.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { fetchAllTasksAdmin } from "../api/tasks.js";
import { useTaskList } from "../hooks/useTaskList.js";

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="font-display text-3xl font-bold">{value}</p>
      <p className="mt-1 font-mono text-xs text-slate-400">{label}</p>
    </div>
  );
}

export default function AdminPage() {
  const { tasks, loading, error, reload } = useTaskList(fetchAllTasksAdmin);

  const userCount = useMemo(() => new Set(tasks.map((task) => task.user?.email)).size, [tasks]);

  return (
    <AppShell>
      <p className="font-mono text-sm text-neon-violet">// administration</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Toutes les tâches</h1>
      <p className="mt-3 text-slate-400">
        Vue en lecture seule des tâches de tous les utilisateurs.
      </p>

      {!loading && !error && (
        <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
          <Stat label="Tâches" value={tasks.length} />
          <Stat label="Utilisateurs" value={userCount} />
        </div>
      )}

      <div className="mt-8 space-y-4">
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

        {!loading && !error && tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">Aucune tâche enregistrée.</p>
        )}

        {!loading &&
          !error &&
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} ownerEmail={task.user?.email} readOnly />
          ))}
      </div>
    </AppShell>
  );
}
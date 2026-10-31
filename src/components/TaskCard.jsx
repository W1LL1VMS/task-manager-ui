import { useState } from "react";
import { STATUSES, STATUS_BY_VALUE } from "../lib/status.js";
import { getErrorMessage } from "../api/errors.js";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TaskCard({
  task,
  ownerEmail,
  readOnly = false,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const status = STATUS_BY_VALUE[task.status];

  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <article
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition ${
        busy ? "opacity-60" : "hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className={`break-words font-display text-lg font-semibold ${
              task.status === "DONE" ? "text-slate-400 line-through decoration-slate-600" : ""
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1.5 whitespace-pre-line break-words text-sm text-slate-400">
              {task.description}
            </p>
          )}
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 font-mono text-xs ${status.badge}`}>
          {status.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-slate-500">
          {ownerEmail ? `${ownerEmail} — ` : ""}créée le {formatDate(task.createdAt)}
        </p>

        {!readOnly && (
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Changer le statut"
              className="flex overflow-hidden rounded-lg border border-white/10"
            >
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  disabled={busy || task.status === s.value}
                  aria-pressed={task.status === s.value}
                  onClick={() => run(() => onStatusChange(task.id, s.value))}
                  className={`px-3 py-1.5 font-mono text-xs transition disabled:cursor-default ${
                    task.status === s.value
                      ? "bg-white/10 text-slate-100"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onEdit(task)}
              className="font-mono text-xs text-slate-400 transition hover:text-neon-cyan"
            >
              Modifier
            </button>

            {confirming ? (
              <span className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Supprimer ?</span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(() => onDelete(task.id))}
                  className="text-red-300 hover:underline"
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="text-slate-400 hover:underline"
                >
                  Non
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="font-mono text-xs text-slate-400 transition hover:text-red-300"
              >
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </article>
  );
}
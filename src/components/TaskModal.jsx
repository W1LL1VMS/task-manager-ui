import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getErrorMessage } from "../api/errors.js";
import FormField from "./FormField.jsx";
import SubmitButton from "./SubmitButton.jsx";

const taskSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis").max(200, "200 caractères maximum"),
  description: z.string().max(2000, "2000 caractères maximum"),
});

export default function TaskModal({ task, onClose, onSubmit }) {
  const isEdit = Boolean(task);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
    },
  });

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const submit = async (values) => {
    setServerError("");
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-30 grid place-items-center p-4">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-ink-900/90 p-7 shadow-[0_0_60px_rgba(0,229,199,0.1)] backdrop-blur-xl"
      >
        <h2 id="task-modal-title" className="font-display text-2xl font-semibold">
          {isEdit ? "Modifier la tâche" : "Nouvelle tâche"}
        </h2>

        <form onSubmit={handleSubmit(submit)} noValidate className="mt-6 space-y-5">
          <FormField
            label="Titre"
            placeholder="Ex. Préparer la présentation"
            registration={register("title")}
            error={errors.title?.message}
          />
          <FormField
            label="Description (facultative)"
            multiline
            rows={4}
            placeholder="Quelques détails utiles…"
            registration={register("description")}
            error={errors.description?.message}
          />

          {serverError && (
            <p
              role="alert"
              className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
            >
              {serverError}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 px-5 py-3 font-mono text-sm text-slate-300 transition hover:border-white/30 hover:text-slate-100"
            >
              Annuler
            </button>
            <div className="flex-1">
              <SubmitButton loading={isSubmitting}>
                {isEdit ? "Enregistrer" : "Créer la tâche"}
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
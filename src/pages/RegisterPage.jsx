import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../api/errors.js";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import SubmitButton from "../components/SubmitButton.jsx";

const registerSchema = z
  .object({
    email: z.string().min(1, "Email requis").email("Email invalide"),
    password: z
      .string()
      .min(8, "Au moins 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const { register: signUp } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    try {
      // Crée le compte puis connecte directement l'utilisateur
      await signUp(email, password);
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Quelques secondes suffisent pour commencer à organiser vos tâches."
      footer={
        <>
          Déjà inscrit ?{" "}
          <Link to="/login" className="text-neon-cyan hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          registration={register("email")}
          error={errors.email?.message}
        />
        <FormField
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="8 caractères minimum"
          registration={register("password")}
          error={errors.password?.message}
        />
        <FormField
          label="Confirmer le mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {serverError && (
          <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {serverError}
          </p>
        )}

        <SubmitButton loading={isSubmitting}>Créer mon compte</SubmitButton>
      </form>
    </AuthLayout>
  );
}
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

const loginSchema = z.object({
  email: z.string().min(1, "Email requis").email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    try {
      // En cas de succès, PublicOnlyRoute redirige automatiquement vers le tableau de bord
      await login(email, password);
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Content de vous revoir. Entrez vos identifiants pour accéder à vos tâches."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-neon-cyan hover:underline">
            Créer un compte
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
          autoComplete="current-password"
          placeholder="••••••••"
          registration={register("password")}
          error={errors.password?.message}
        />

        {serverError && (
          <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {serverError}
          </p>
        )}

        <SubmitButton loading={isSubmitting}>Se connecter</SubmitButton>
      </form>
    </AuthLayout>
  );
}
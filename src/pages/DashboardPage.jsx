import Background from "../components/Background.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-svh">
      <Background />
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="font-mono text-sm text-neon-cyan">// session active</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Bienvenue, {user.email}</h1>
        <p className="mt-3 text-slate-400">
          Rôle : {user.role}. Le tableau de bord des tâches arrive à l'étape suivante.
        </p>
        <button
          onClick={logout}
          className="mt-8 rounded-xl border border-white/15 px-5 py-2.5 font-mono text-sm text-slate-200 transition hover:border-neon-cyan hover:text-neon-cyan"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
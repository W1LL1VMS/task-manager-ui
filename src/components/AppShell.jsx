import { NavLink } from "react-router-dom";
import Background from "./Background.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 font-mono text-sm transition ${
    isActive ? "bg-white/10 text-neon-cyan" : "text-slate-400 hover:text-slate-100"
  }`;

export default function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-svh">
      <Background />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="font-mono text-sm">
              task<span className="text-neon-cyan">.manager</span>
            </span>
            <nav className="flex items-center gap-1">
              <NavLink to="/" end className={linkClass}>
                Mes tâches
              </NavLink>
              {user.role === "ADMIN" && (
                <NavLink to="/admin" className={linkClass}>
                  Administration
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden max-w-[14rem] truncate font-mono text-xs text-slate-400 sm:block">
              {user.email}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs text-slate-200 transition hover:border-neon-cyan hover:text-neon-cyan"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
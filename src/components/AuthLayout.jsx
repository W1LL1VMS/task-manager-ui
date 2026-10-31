import Background from "./Background.jsx";

const highlights = [
  "Session renouvelée automatiquement",
  "Données cloisonnées par utilisateur",
  "Accès admin séparé",
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-svh">
      <Background />
      <div className="mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <section className="hidden lg:block">
          <p className="mb-5 font-mono text-sm text-neon-cyan">// task-manager</p>
          <h1 className="bg-linear-to-r from-white via-neon-cyan to-neon-violet bg-clip-text font-display text-6xl font-bold leading-[1.02] tracking-tight text-transparent">
            Vos tâches,
            <br />
            sous contrôle.
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-400">
            Une interface rapide branchée sur une API sécurisée, pensée pour que chaque utilisateur ne voie que ses propres données.
          </p>
          <ul className="mt-10 space-y-3 font-mono text-sm text-slate-300">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_var(--color-neon-cyan)]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <main className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_60px_rgba(0,229,199,0.08)] backdrop-blur-xl">
            <h2 className="font-display text-3xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
          <p className="mt-6 text-center text-sm text-slate-400">{footer}</p>
        </main>
      </div>
    </div>
  );
}
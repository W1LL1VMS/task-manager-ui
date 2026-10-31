export default function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-xl bg-linear-to-r from-neon-cyan to-neon-violet px-4 py-3 font-mono text-sm font-medium text-ink-950 transition hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(0,229,199,0.3)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
    >
      {loading ? "Veuillez patienter…" : children}
    </button>
  );
}
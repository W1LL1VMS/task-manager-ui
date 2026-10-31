export default function FormField({
  label,
  type = "text",
  multiline = false,
  rows = 4,
  registration,
  error,
  autoComplete,
  placeholder,
}) {
  const className = `w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-neon-cyan focus:ring-4 focus:ring-neon-cyan/15 ${
    error ? "border-red-400/60" : "border-white/10"
  }`;

  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs text-slate-400">{label}</span>
      {multiline ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          className={`${className} resize-none`}
          {...registration}
        />
      ) : (
        <input
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          className={className}
          {...registration}
        />
      )}
      {error && (
        <span role="alert" className="mt-2 block text-sm text-red-300">
          {error}
        </span>
      )}
    </label>
  );
}
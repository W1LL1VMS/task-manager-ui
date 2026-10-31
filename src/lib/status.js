// Les trois statuts du backend, avec leur libellé et leurs couleurs
export const STATUSES = [
  {
    value: "TODO",
    label: "À faire",
    badge: "border-slate-400/30 bg-slate-400/10 text-slate-200",
  },
  {
    value: "IN_PROGRESS",
    label: "En cours",
    badge: "border-neon-violet/40 bg-neon-violet/10 text-violet-200",
  },
  {
    value: "DONE",
    label: "Terminé",
    badge: "border-neon-cyan/40 bg-neon-cyan/10 text-cyan-200",
  },
];

export const STATUS_BY_VALUE = Object.fromEntries(STATUSES.map((s) => [s.value, s]));
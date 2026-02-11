export default function Badge({ children, tone = "default" }) {
  const cls =
    tone === "success"
      ? "bg-emerald-100 text-emerald-800"
      : tone === "warning"
      ? "bg-amber-100 text-amber-800"
      : tone === "danger"
      ? "bg-rose-100 text-rose-800"
      : "bg-slate-100 text-slate-700";

  return <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${cls}`}>{children}</span>;
}

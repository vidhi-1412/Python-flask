export default function InfoCard({ title, value, subtitle, tone = "default" }) {
  const toneStyles =
    tone === "ok"
      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
      : tone === "warn"
      ? "bg-amber-50 border-amber-200 text-amber-900"
      : tone === "bad"
      ? "bg-rose-50 border-rose-200 text-rose-900"
      : "bg-white border-slate-200 text-slate-900";

  return (
    <div className={`rounded-2xl border p-4 shadow-sm hover:shadow transition-all ${toneStyles}`}>
      <div className="text-sm font-semibold text-slate-600">{title}</div>
      <div className="mt-2 flex items-end gap-2">
        <div className="text-3xl font-bold">{value}</div>
        {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
      </div>
    </div>
  );
}

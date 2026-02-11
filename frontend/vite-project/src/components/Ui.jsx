export function Card({ title, children }) {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow transition-shadow duration-200">
      {title ? <h3 className="font-bold text-slate-800 mb-2">{title}</h3> : null}
      {children}
    </div>
  );
}

export function Button({ variant = "primary", ...props }) {
  const base =
    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]";
  const styles =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "secondary"
      ? "bg-white border text-slate-700 hover:shadow"
      : "bg-slate-900 text-white hover:bg-slate-800";
  return <button className={`${base} ${styles}`} {...props} />;
}

export function Input(props) {
  return (
    <input
      className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
      {...props}
    />
  );
}

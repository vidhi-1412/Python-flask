import { NavLink } from "react-router-dom";

const base =
  "px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 border";
const active = "bg-slate-900 text-white border-slate-900 shadow";
const inactive =
  "bg-white text-slate-700 border-slate-200 hover:-translate-y-0.5 hover:shadow";

export default function AppNavbar() {
  return (
    <nav className="mt-5 flex flex-wrap gap-2">
      <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        User Dashboard
      </NavLink>
      <NavLink to="/orders" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        Orders
      </NavLink>
      <NavLink to="/inventory" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        Inventory
      </NavLink>
      <NavLink to="/admin" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        Admin Dashboard
      </NavLink>
    </nav>
  );
}

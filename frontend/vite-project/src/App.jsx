import { Route, Routes, Navigate } from "react-router-dom";
import AppNavbar from "./components/AppNavbar.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6 fade-in">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manufacturing Dashboard</h1>
            <p className="text-slate-600 text-sm">
              React UI + Flask API • Orders & Inventory • Admin Monitoring
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-xl bg-white border shadow-sm text-sm text-slate-600">
              Status: <span className="font-semibold text-slate-900">Local</span>
            </div>
          </div>
        </header>

        <AppNavbar />

        <main className="mt-5">
          <Routes>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="mt-10 text-xs text-slate-500">
          Built for Minikube/Kubernetes rolling updates demo.
        </footer>
      </div>
    </div>
  );
}

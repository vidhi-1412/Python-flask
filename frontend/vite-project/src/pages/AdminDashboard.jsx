// src/pages/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import ApiClient from "../api/ApiClient";
import InfoCard from "../components/InfoCard.jsx";
import LoadingText from "../components/LoadingText.jsx";
import Badge from "../components/Badge.jsx";

// ✅ DUMMY (Testing only)
const dummyInventory = [
  { id: 1, item_name: "Steel", stock_qty: 20, min_threshold: 30 },
  { id: 2, item_name: "Bolts", stock_qty: 120, min_threshold: 50 },
  { id: 3, item_name: "Wires", stock_qty: 10, min_threshold: 25 },
];

const dummySummary = { total_orders: 7, pending_orders: 3, low_stock_items: 2 };

export default function AdminDashboard() {
  const [health, setHealth] = useState({ healthz: "UNKNOWN", readyz: "UNKNOWN" });
  const [summary, setSummary] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setErr("");

      // ✅ health (never throw)
      const [h, r] = await Promise.allSettled([
        ApiClient.get("/healthz"),
        ApiClient.get("/readyz"),
      ]);

      const nextHealth = {
        healthz: h.status === "fulfilled" ? "OK" : "FAIL",
        readyz: r.status === "fulfilled" ? "OK" : "FAIL",
      };
      setHealth(nextHealth);

      // ✅ summary + inventory (never throw)
      const [s, inv] = await Promise.allSettled([
        ApiClient.get("/summary"),
        ApiClient.get("/inventory"),
      ]);

      if (s.status === "fulfilled") setSummary(s.value.data);
      else {
        setSummary(dummySummary);
        setErr("Backend down: showing dummy data for admin dashboard.");
      }

      if (inv.status === "fulfilled") setInventory(inv.value.data);
      else setInventory(dummyInventory);
    };

    load();
  }, []);

  const lowStockItems = useMemo(
    () => inventory.filter((it) => Number(it.stock_qty) < Number(it.min_threshold)),
    [inventory]
  );

  const connectionTone = err ? "warning" : "success";
  const connectionText = err ? "Demo mode" : "Connected";

  const healthTone =
    health.healthz === "OK" ? "success" : health.healthz === "FAIL" ? "danger" : "default";
  const readyTone =
    health.readyz === "OK" ? "success" : health.readyz === "FAIL" ? "danger" : "default";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-extrabold">Admin Dashboard</h2>
          <p className="text-sm text-slate-600">
            Monitoring + low stock alerts (inventory updates happen on Inventory page)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone={connectionTone}>{connectionText}</Badge>
          {lowStockItems.length ? (
            <Badge tone="danger">{lowStockItems.length} Low Stock</Badge>
          ) : (
            <Badge tone="success">No Alerts</Badge>
          )}
        </div>
      </div>

      {/* Error banner (nice) */}
      {err ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl">
          <div className="font-semibold">Backend not reachable</div>
          <div className="text-sm text-amber-800">{err}</div>
        </div>
      ) : null}

      {/* Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-600">System Health</div>
              <div className="mt-1 text-xs text-slate-500">GET /api/healthz</div>
            </div>
            <Badge tone={healthTone}>{health.healthz}</Badge>
          </div>
          <div className="mt-3 text-sm text-slate-600">
            Liveness probe checks if the app is running.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-600">System Ready</div>
              <div className="mt-1 text-xs text-slate-500">GET /api/readyz</div>
            </div>
            <Badge tone={readyTone}>{health.readyz}</Badge>
          </div>
          <div className="mt-3 text-sm text-slate-600">
            Readiness probe checks if the app can take traffic.
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {!summary ? (
        <LoadingText />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InfoCard title="Total Orders" value={summary.total_orders ?? 0} />
          <InfoCard title="Pending Orders" value={summary.pending_orders ?? 0} />
          <InfoCard title="Low Stock Items" value={summary.low_stock_items ?? 0} />
        </div>
      )}

      {/* Low stock table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Low Stock Alerts</h3>
            <p className="text-sm text-slate-600">Items below threshold (needs action)</p>
          </div>
          <Badge tone="default">Read-only</Badge>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-t border-b text-slate-600">
              <tr className="text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Min Threshold</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {lowStockItems.length ? (
                lowStockItems.map((it) => (
                  <tr key={it.id} className="border-b hover:bg-slate-50 transition">
                    <td className="py-3 px-4">{it.id}</td>
                    <td className="py-3 px-4 font-semibold">{it.item_name}</td>
                    <td className="py-3 px-4">{it.stock_qty}</td>
                    <td className="py-3 px-4">{it.min_threshold}</td>
                    <td className="py-3 px-4">
                      <Badge tone="danger">LOW</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 text-slate-500" colSpan="5">
                    No low stock items 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-slate-600">
          Admin can update inventory from <span className="font-semibold">Inventory</span> page.
        </div>
      </div>
    </div>
  );
}

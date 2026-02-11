// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import ApiClient from "../api/ApiClient";
import InfoCard from "../components/InfoCard.jsx";
import LoadingText from "../components/LoadingText.jsx";
import Badge from "../components/Badge.jsx";

/**
 * ✅ DUMMY DATA (Testing only)
 * - Backend down ho to UI ko test karne ke liye use hota hai.
 * - Later tum easily delete kar sakte ho.
 */

// Inventory dummy
const dummyInventory = [
  { id: 1, item_name: "Steel", stock_qty: 20, min_threshold: 30 },
  { id: 2, item_name: "Bolts", stock_qty: 120, min_threshold: 50 },
  { id: 3, item_name: "Wires", stock_qty: 10, min_threshold: 25 },
  { id: 4, item_name: "Nuts", stock_qty: 60, min_threshold: 40 },
  { id: 5, item_name: "Plates", stock_qty: 15, min_threshold: 20 },
];

// Orders dummy (so Pending/Completed also correct)
const dummyOrders = [
  { id: 1, product_name: "Gear", quantity: 10, status: "Pending" },
  { id: 2, product_name: "Bolt Pack", quantity: 50, status: "Completed" },
  { id: 3, product_name: "Steel Sheet", quantity: 5, status: "Pending" },
  { id: 4, product_name: "Wire Roll", quantity: 2, status: "Completed" },
];

// ✅ DUMMY summary calculate function (dynamic, always correct)
const makeDummySummary = () => {
  const totalOrders = dummyOrders.length;
  const pendingOrders = dummyOrders.filter((o) => o.status === "Pending").length;
  const completedOrders = dummyOrders.filter((o) => o.status === "Completed").length;

  const lowStockCount = dummyInventory.filter(
    (it) => Number(it.stock_qty) < Number(it.min_threshold)
  ).length;

  return {
    total_orders: totalOrders,
    pending_orders: pendingOrders,
    completed_orders: completedOrders,
    low_stock_items: lowStockCount,
  };
};

export default function UserDashboard() {
  const [summary, setSummary] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setErr("");

      // ✅ We try to load from backend
      const [s, inv] = await Promise.allSettled([
        ApiClient.get("/summary"),
        ApiClient.get("/inventory"),
      ]);

      // Inventory
      if (inv.status === "fulfilled") setInventory((inv.value.data || []).slice(0, 5));
      else setInventory(dummyInventory.slice(0, 5));

      // Summary
      if (s.status === "fulfilled") setSummary(s.value.data);
      else {
        setSummary(makeDummySummary()); // ✅ Dynamic dummy summary
        setErr("Backend down: showing dummy data.");
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Dashboard</h2>
          <p className="text-sm text-slate-600">Daily operations overview</p>
        </div>
        {err ? <Badge tone="warning">{err}</Badge> : <Badge tone="success">Connected</Badge>}
      </div>

      {!summary ? (
        <LoadingText text="Loading summary..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <InfoCard title="Total Orders" value={summary.total_orders ?? 0} />
          <InfoCard title="Pending" value={summary.pending_orders ?? 0} tone="warn" />
          <InfoCard title="Completed" value={summary.completed_orders ?? 0} tone="ok" />
          <InfoCard title="Low Stock" value={summary.low_stock_items ?? 0} tone="bad" />
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold">Inventory Quick View</h3>
            <p className="text-sm text-slate-600">Top 5 items</p>
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
                <th className="py-3 px-4">Min</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {inventory?.length ? (
                inventory.map((it) => {
                  const low = Number(it.stock_qty) < Number(it.min_threshold);
                  return (
                    <tr key={it.id} className="border-b hover:bg-slate-50 transition">
                      <td className="py-3 px-4">{it.id}</td>
                      <td className="py-3 px-4 font-semibold">{it.item_name}</td>
                      <td className="py-3 px-4">{it.stock_qty}</td>
                      <td className="py-3 px-4">{it.min_threshold}</td>
                      <td className="py-3 px-4">
                        {low ? <Badge tone="danger">LOW</Badge> : <Badge tone="success">OK</Badge>}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-4 px-4 text-slate-500" colSpan="5">
                    No inventory items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ DUMMY SECTION INFO (Testing only) */}
      {err ? (
        <p className="text-xs text-slate-400">
          NOTE: Dummy summary is computed from dummyOrders + dummyInventory. Remove this later when backend is ready.
        </p>
      ) : null}
    </div>
  );
}

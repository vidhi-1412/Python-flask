// src/pages/InventoryPage.jsx
import { useEffect, useState } from "react";
import ApiClient from "../api/ApiClient";
import { Button, Card, Input } from "../components/Ui";

// ✅ DUMMY DATA (Testing only) - backend connect hone ke baad remove kar dena
const dummyInventory = [
  { id: 1, item_name: "Steel", stock_qty: 20, min_threshold: 30 },
  { id: 2, item_name: "Bolts", stock_qty: 120, min_threshold: 50 },
  { id: 3, item_name: "Wires", stock_qty: 10, min_threshold: 25 },
];

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  // Create item (Admin)
  const [itemName, setItemName] = useState("");
  const [stockQty, setStockQty] = useState(0);
  const [minThreshold, setMinThreshold] = useState(0);

  // ✅ per-row edit state (Update button ke liye)
  const [editMap, setEditMap] = useState({}); // { [id]: { stock_qty, min_threshold } }

  const loadInventory = async () => {
    setErr("");
    try {
      const res = await ApiClient.get("/inventory");
      setItems(res.data);

      // ✅ keep editMap in sync
      const next = {};
      (res.data || []).forEach((it) => {
        next[it.id] = { stock_qty: it.stock_qty, min_threshold: it.min_threshold };
      });
      setEditMap(next);
    } catch {
      setErr("Failed to load inventory (check Flask API). Showing dummy data for testing.");

      // ✅ DUMMY (Testing only)
      setItems(dummyInventory);

      const next = {};
      dummyInventory.forEach((it) => {
        next[it.id] = { stock_qty: it.stock_qty, min_threshold: it.min_threshold };
      });
      setEditMap(next);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const createItem = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await ApiClient.post("/inventory", {
        item_name: itemName,
        stock_qty: Number(stockQty),
        min_threshold: Number(minThreshold),
      });

      setItemName("");
      setStockQty(0);
      setMinThreshold(0);
      await loadInventory();
    } catch {
      setErr("Create inventory item failed. Backend needs POST /api/inventory.");

      // ✅ DUMMY (Testing only): locally add
      const newLocal = {
        id: Date.now(),
        item_name: itemName || "New Item",
        stock_qty: Number(stockQty),
        min_threshold: Number(minThreshold),
      };
      setItems((prev) => [newLocal, ...prev]);
      setEditMap((prev) => ({
        ...prev,
        [newLocal.id]: { stock_qty: newLocal.stock_qty, min_threshold: newLocal.min_threshold },
      }));

      setItemName("");
      setStockQty(0);
      setMinThreshold(0);
    }
  };

  const updateItem = async (id) => {
    setErr("");
    const payload = editMap[id];

    try {
      await ApiClient.put(`/inventory/${id}`, payload);
      await loadInventory();
    } catch {
      setErr("Update failed (backend). Updated locally for testing.");

      // ✅ DUMMY (Testing only): update locally
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...payload } : it)));
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this inventory item?")) return;
    setErr("");
    try {
      await ApiClient.delete(`/inventory/${id}`);
      await loadInventory();
    } catch {
      setErr("Delete failed (backend). Deleted locally for testing.");

      // ✅ DUMMY (Testing only)
      setItems((prev) => prev.filter((it) => it.id !== id));
      setEditMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory</h2>
        <span className="text-sm text-slate-500">Admin can manage stock</span>
      </div>

      {err ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl">{err}</div>
      ) : null}

      <Card title="Add Inventory Item (Admin Role)">
        <form onSubmit={createItem} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Item Name</label>
            <Input value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-600">Stock Qty</label>
            <Input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-600">Min Threshold</label>
            <Input type="number" value={minThreshold} onChange={(e) => setMinThreshold(e.target.value)} required />
          </div>

          <div className="md:col-span-4">
            <Button>Add Item</Button>
          </div>
        </form>
      </Card>

      <Card title="Inventory List (User View + Admin Update)">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b">
                <th className="py-2">ID</th>
                <th>Item</th>
                <th>Stock</th>
                <th>Min Threshold</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items?.length ? (
                items.map((it) => {
                  const isLow = Number(it.stock_qty) < Number(it.min_threshold);

                  const current = editMap[it.id] ?? {
                    stock_qty: it.stock_qty,
                    min_threshold: it.min_threshold,
                  };

                  return (
                    <tr key={it.id} className="border-b hover:bg-slate-50 transition">
                      <td className="py-2">{it.id}</td>

                      <td>
                        <span className={isLow ? "text-red-700 font-semibold" : ""}>{it.item_name}</span>
                        {isLow ? (
                          <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg">LOW</span>
                        ) : null}
                      </td>

                      <td className="w-40">
                        <Input
                          type="number"
                          value={current.stock_qty}
                          onChange={(e) =>
                            setEditMap((prev) => ({
                              ...prev,
                              [it.id]: { ...current, stock_qty: Number(e.target.value) },
                            }))
                          }
                        />
                      </td>

                      <td className="w-48">
                        <Input
                          type="number"
                          value={current.min_threshold}
                          onChange={(e) =>
                            setEditMap((prev) => ({
                              ...prev,
                              [it.id]: { ...current, min_threshold: Number(e.target.value) },
                            }))
                          }
                        />
                      </td>

                      <td className="py-2">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" onClick={() => updateItem(it.id)}>
                            Update
                          </Button>
                          <Button variant="danger" onClick={() => deleteItem(it.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-3 text-slate-500" colSpan="5">
                    No inventory items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ After backend ready, remove:
            - dummyInventory
            - loadInventory catch me dummy set
            - create/update/delete catch me local updates (optional)
        */}
      </Card>
    </div>
  );
}

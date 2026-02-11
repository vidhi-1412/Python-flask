// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import ApiClient from "../api/ApiClient";
import { Button, Card, Input } from "../components/Ui";

// ✅ DUMMY DATA (Testing only) - backend connect hone ke baad remove kar dena
const dummyOrders = [
  { id: 1, product_name: "Gear", quantity: 10, status: "PENDING" },
  { id: 2, product_name: "Bolt Pack", quantity: 5, status: "COMPLETED" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);

  // editing
  const [editingId, setEditingId] = useState(null);
  const [editProduct, setEditProduct] = useState("");
  const [editQty, setEditQty] = useState(1);
  const [editStatus, setEditStatus] = useState("PENDING");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    setErr("");
    try {
      const res = await ApiClient.get("/orders");
      setOrders(res.data);
    } catch {
      setErr("Failed to load orders (check Flask API). Showing dummy data for testing.");
      // ✅ DUMMY (Testing only)
      setOrders(dummyOrders);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const createOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      await ApiClient.post("/orders", {
        product_name: productName,
        quantity: Number(quantity),
      });
      setProductName("");
      setQuantity(1);
      await loadOrders();
    } catch {
      setErr("Failed to create order. Added locally for testing.");

      // ✅ DUMMY (Testing only): local add
      const newLocal = {
        id: Date.now(),
        product_name: productName || "New Order",
        quantity: Number(quantity),
        status: "PENDING",
      };
      setOrders((prev) => [newLocal, ...prev]);
      setProductName("");
      setQuantity(1);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (o) => {
    setEditingId(o.id);
    setEditProduct(o.product_name);
    setEditQty(o.quantity);
    setEditStatus(o.status);
  };

  const cancelEdit = () => setEditingId(null);

  const updateOrder = async () => {
    setErr("");
    try {
      await ApiClient.put(`/orders/${editingId}`, {
        product_name: editProduct,
        quantity: Number(editQty),
        status: editStatus,
      });
      setEditingId(null);
      await loadOrders();
    } catch {
      setErr("Failed to update order (backend). Updated locally for testing.");

      // ✅ DUMMY (Testing only): local update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingId
            ? { ...o, product_name: editProduct, quantity: Number(editQty), status: editStatus }
            : o
        )
      );
      setEditingId(null);
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm("Delete this order?")) return;
    setErr("");
    try {
      await ApiClient.delete(`/orders/${id}`);
      await loadOrders();
    } catch {
      setErr("Delete failed (backend). Deleted locally for testing.");

      // ✅ DUMMY (Testing only)
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders</h2>
        <span className="text-sm text-slate-500">User can create / update / delete</span>
      </div>

      {err ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl">{err}</div>
      ) : null}

      <Card title="Create Order (User Role)">
        <form onSubmit={createOrder} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Product Name</label>
            <Input value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-600">Quantity</label>
            <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </div>
          <Button disabled={loading}>{loading ? "Saving..." : "Create"}</Button>
        </form>
      </Card>

      <Card title="Orders List (User + Admin)">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b">
                <th className="py-2">ID</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders?.length ? (
                orders.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-slate-50 transition">
                    <td className="py-2">{o.id}</td>

                    <td>
                      {editingId === o.id ? (
                        <Input value={editProduct} onChange={(e) => setEditProduct(e.target.value)} />
                      ) : (
                        o.product_name
                      )}
                    </td>

                    <td className="w-28">
                      {editingId === o.id ? (
                        <Input type="number" min="1" value={editQty} onChange={(e) => setEditQty(e.target.value)} />
                      ) : (
                        o.quantity
                      )}
                    </td>

                    <td className="w-40">
                      {editingId === o.id ? (
                        <select
                          className="border rounded-xl px-3 py-2 w-full"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            o.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {o.status}
                        </span>
                      )}
                    </td>

                    <td className="py-2">
                      <div className="flex justify-end gap-2">
                        {editingId === o.id ? (
                          <>
                            <Button onClick={updateOrder}>Update</Button>
                            <Button variant="secondary" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="secondary" onClick={() => startEdit(o)}>
                              Edit
                            </Button>
                            <Button variant="danger" onClick={() => deleteOrder(o.id)}>
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 text-slate-500" colSpan="5">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ After backend ready, remove:
            - dummyOrders
            - catch me local add/update/delete (optional)
        */}
      </Card>
    </div>
  );
}

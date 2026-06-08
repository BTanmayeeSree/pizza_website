import React, { useEffect, useState, useCallback } from "react";
import {
  Pizza, TrendingUp, ShoppingBag, Package, Users, CreditCard, Bell,
  Settings, LogOut, AlertTriangle, Plus, Trash2, Edit3, X, CheckCircle2,
  RefreshCw, IndianRupee, Eye
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext";
import { analyticsAPI, inventoryAPI, orderAPI, userAPI, txnAPI, settingsAPI, notifAPI } from "../services/store";
import { socket } from "../services/socket";
import type { InventoryItem, Order, User, Transaction, Settings as SettingsType, AppNotification, OrderStatus } from "../types";

type AdminTab = "dashboard" | "orders" | "inventory" | "users" | "payments" | "notifications" | "settings";

function Spinner() { return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />; }
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${ok ? "bg-green-600 text-white" : "bg-destructive text-white"}`}><CheckCircle2 className="w-4 h-4" /> {msg}</div>;
}

const STATUS_COLORS: Record<string, string> = {
  "Order Received": "bg-blue-100 text-blue-700", "In Kitchen": "bg-amber-100 text-amber-700",
  "Out for Delivery": "bg-orange-100 text-orange-700", "Delivered": "bg-green-100 text-green-700",
  "Cancelled": "bg-red-100 text-red-700",
};
const NEXT: Record<string, string> = {
  "Order Received": "In Kitchen", "In Kitchen": "Out for Delivery", "Out for Delivery": "Delivered",
};
const NOTIF_COLORS: Record<string, string> = { order: "bg-blue-100 text-blue-600", payment: "bg-green-100 text-green-600", stock: "bg-red-100 text-red-600", system: "bg-purple-100 text-purple-600" };

// ─── Reusable section wrapper ────────────────────────────────────────────────
function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function DashboardTab() {
  const [data, setData] = useState<Awaited<ReturnType<typeof analyticsAPI.get>> | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inv, setInv] = useState<InventoryItem[]>([]);

  const load = useCallback(async () => {
    const [d, o, i] = await Promise.all([analyticsAPI.get(), orderAPI.getAll(), inventoryAPI.getAll()]);
    setData(d); setOrders(o.slice(0, 5)); setInv(i.filter((x) => x.quantity < x.threshold));
  }, []);

  useEffect(() => { load(); const u = socket.on("dashboard:refresh", load); return u; }, [load]);

  if (!data) return <div className="flex items-center justify-center py-20"><Spinner /></div>;

  const stats = [
    { label: "Total Revenue", value: `₹${data.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Orders", value: data.totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Low Stock Items", value: inv.length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Today Revenue", value: `₹${data.last7.at(-1)?.revenue.toLocaleString("en-IN") ?? 0}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <div className={`w-9 h-9 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}><Icon className="w-4 h-4" /></div>
            <p className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <p className="text-sm font-semibold text-foreground mb-3">Revenue (Last 7 Days)</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.last7}>
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c0392b" stopOpacity={0.25}/><stop offset="95%" stopColor="#c0392b" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(v) => [`₹${v}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#c0392b" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <p className="text-sm font-semibold text-foreground mb-3">Orders (Last 7 Days)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#e67e22" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border shadow-sm">
          <div className="p-4 border-b border-border"><p className="text-sm font-semibold text-foreground">Recent Orders</p></div>
          <div className="divide-y divide-border">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-4 py-3">
                <div><p className="text-sm font-medium text-foreground">{o.id}</p><p className="text-xs text-muted-foreground">{o.userName}</p></div>
                <div className="text-right"><p className="text-sm font-semibold text-primary">₹{o.total}</p><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-sm">
          <div className="p-4 border-b border-border"><p className="text-sm font-semibold text-foreground">Top Pizzas</p></div>
          <div className="divide-y divide-border">
            {data.topPizzas.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-4 py-3">
                <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span>
                <p className="text-sm text-foreground flex-1">{p.name}</p>
                <p className="text-sm font-semibold text-muted-foreground">{p.count} orders</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {inv.length > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-destructive" /><p className="text-sm font-semibold text-destructive">Low Stock Alerts</p></div>
          <div className="flex flex-wrap gap-2">
            {inv.map((i) => <span key={i.id} className="bg-destructive/10 text-destructive text-xs px-2.5 py-1 rounded-full">{i.name} ({i.quantity} {i.unit} left)</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Orders Tab ──────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [detail, setDetail] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => { setLoading(true); setOrders(await orderAPI.getAll()); setLoading(false); };
  useEffect(() => { load(); const u = socket.on("order:status", load); return u; }, []);

  const advance = async (id: string, currentStatus: string) => {
    const next = NEXT[currentStatus];
    if (!next) return;
    setUpdating(id);
    await orderAPI.updateStatus(id, next as OrderStatus);
    await load();
    setUpdating(null);
  };

  return (
    <Section title="Order Management" action={<button onClick={load} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"><RefreshCw className="w-4 h-4" /> Refresh</button>}>
      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted">{["Order ID","Customer","Items","Amount","Payment","Status","Action"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wide font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{o.id}</td>
                    <td className="px-4 py-3"><p className="font-medium text-foreground">{o.userName}</p><p className="text-xs text-muted-foreground">{o.userEmail}</p></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">{o.items.map((i) => `${i.name}×${i.quantity}`).join(", ")}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">₹{o.total}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${o.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{o.paymentStatus}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setDetail(o)} className="p-1.5 rounded-lg border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        {NEXT[o.status] && (
                          <button onClick={() => advance(o.id, o.status)} disabled={updating === o.id}
                            className="px-2.5 py-1.5 rounded-lg text-xs border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 flex items-center gap-1">
                            {updating === o.id ? <Spinner /> : null} Advance
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Order Details — {detail.id}</h3>
              <button onClick={() => setDetail(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium text-foreground">{detail.userName}</p></div>
                <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold text-primary">₹{detail.total}</p></div>
                <div><p className="text-xs text-muted-foreground">Payment</p><span className={`text-xs px-2 py-0.5 rounded-full ${detail.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{detail.paymentStatus}</span></div>
                <div><p className="text-xs text-muted-foreground">Payment ID</p><p className="text-xs font-mono text-muted-foreground">{detail.paymentId}</p></div>
              </div>
              <div><p className="text-xs text-muted-foreground mb-1">Address</p><p className="text-sm text-foreground">{detail.address}</p></div>
              <div><p className="text-xs text-muted-foreground mb-2">Items</p>
                {detail.items.map((i) => <div key={i.id} className="flex justify-between text-sm py-1 border-b border-border last:border-0"><span className="text-foreground">{i.name} × {i.quantity}</span><span className="font-medium text-foreground">₹{i.price * i.quantity}</span></div>)}
              </div>
              <div><p className="text-xs text-muted-foreground mb-2">Status History</p>
                {detail.statusHistory.map((h, i) => <div key={i} className="flex justify-between text-xs py-0.5"><span className="text-foreground">{h.status}</span><span className="text-muted-foreground">{new Date(h.time).toLocaleString("en-IN")}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── Inventory Tab ───────────────────────────────────────────────────────────
function InventoryTab() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Cheese", quantity: 0, threshold: 5, unit: "kg" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const load = async () => { setLoading(true); setItems(await inventoryAPI.getAll()); setLoading(false); };
  useEffect(() => { load(); const u = socket.on("inventory:update", load); return u; }, []);

  const handleSave = async () => {
    setSaving(true);
    if (editItem) { await inventoryAPI.update(editItem.id, form); setEditItem(null); showToast("Inventory updated!"); }
    else { await inventoryAPI.add(form); setAdding(false); showToast("Item added!"); }
    await load(); setSaving(false);
    setForm({ name: "", category: "Cheese", quantity: 0, threshold: 5, unit: "kg" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await inventoryAPI.delete(id);
    await load();
    showToast("Item deleted.");
  };

  const openEdit = (item: InventoryItem) => {
    setForm({ name: item.name, category: item.category, quantity: item.quantity, threshold: item.threshold, unit: item.unit });
    setEditItem(item);
  };

  return (
    <Section title="Inventory Management" action={
      <button onClick={() => { setAdding(true); setForm({ name: "", category: "Cheese", quantity: 0, threshold: 5, unit: "kg" }); }}
        className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity">
        <Plus className="w-4 h-4" /> Add Item
      </button>
    }>
      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted">{["Ingredient","Category","Quantity","Threshold","Status","Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wide font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {items.map((item) => {
                  const low = item.quantity < item.threshold;
                  return (
                    <tr key={item.id} className={`border-t border-border transition-colors ${low ? "bg-destructive/5 hover:bg-destructive/8" : "hover:bg-muted/30"}`}>
                      <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">{low && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}{item.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{item.quantity} {item.unit}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.threshold} {item.unit}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${low ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-700"}`}>{low ? "Low Stock" : "In Stock"}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg border border-border hover:border-destructive text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(editItem || adding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-card rounded-2xl w-full max-w-sm shadow-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{editItem ? "Edit Inventory Item" : "Add Inventory Item"}</h3>
              <button onClick={() => { setEditItem(null); setAdding(false); }}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              {[["name", "Name", "text"], ["category", "Category", "text"], ["unit", "Unit (kg/L/pcs)", "text"]].map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                  <input value={(form as Record<string, unknown>)[key] as string} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
                </div>
              ))}
              {[["quantity", "Quantity"], ["threshold", "Low Stock Threshold"]].map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                  <input type="number" value={(form as Record<string, unknown>)[key] as number} onChange={(e) => setForm((f) => ({ ...f, [key]: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
                </div>
              ))}
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {saving ? <><Spinner /> Saving...</> : "Save"}
            </button>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </Section>
  );
}

// ─── Users Tab ───────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<User | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };
  const load = async () => { setLoading(true); setUsers((await userAPI.getAll()).filter((u) => u.role === "user")); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleBlock = async (id: string, blocked: boolean) => {
    await userAPI.block(id, blocked);
    await load();
    showToast(blocked ? "User blocked." : "User unblocked.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    await userAPI.delete(id);
    await load();
    showToast("User deleted.");
  };

  return (
    <Section title="User Management">
      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted">{["Name","Email","Phone","Verified","Status","Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wide font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={`border-t border-border hover:bg-muted/30 transition-colors ${u.blocked ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3"><p className="font-medium text-foreground">{u.name}</p></td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{u.phone || "—"}</td>
                    <td className="px-4 py-3">{u.verified ? <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Yes</span> : <span className="text-xs text-amber-600">No</span>}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{u.blocked ? "Blocked" : "Active"}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setDetail(u)} className="p-1.5 rounded-lg border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleBlock(u.id, !u.blocked)} className="px-2.5 py-1 rounded-lg text-xs border border-border hover:border-amber-500 text-muted-foreground hover:text-amber-600 transition-colors">{u.blocked ? "Unblock" : "Block"}</button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg border border-border hover:border-destructive text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-card rounded-2xl w-full max-w-sm shadow-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">User Details</h3>
              <button onClick={() => setDetail(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-primary font-bold text-lg">{detail.name[0]}</span></div>
              <div><p className="font-semibold text-foreground">{detail.name}</p><p className="text-xs text-muted-foreground">{detail.email}</p></div>
            </div>
            <div className="space-y-2 text-sm">
              {[["Phone", detail.phone || "—"], ["Verified", detail.verified ? "Yes ✓" : "No"], ["Status", detail.blocked ? "Blocked" : "Active"], ["Member Since", new Date(detail.createdAt).toLocaleDateString("en-IN")], ["Saved Addresses", detail.addresses.length + " addresses"]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium text-foreground">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </Section>
  );
}

// ─── Payments Tab ────────────────────────────────────────────────────────────
function PaymentsTab() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Transaction | null>(null);

  useEffect(() => { txnAPI.getAll().then((d) => { setTxns(d); setLoading(false); }); }, []);

  const total = txns.filter((t) => t.status === "Paid").reduce((s, t) => s + t.amount, 0);

  return (
    <Section title="Payment Transactions">
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[["Total Revenue", `₹${total.toLocaleString("en-IN")}`, "text-green-600"], ["Transactions", txns.length, "text-blue-600"], ["Failed", txns.filter((t) => t.status === "Failed").length, "text-red-600"]].map(([label, val, color]) => (
          <div key={label as string} className="bg-card rounded-xl border border-border p-3 text-center shadow-sm">
            <p className={`text-lg font-bold ${color}`} style={{ fontFamily: "'Playfair Display', serif" }}>{val}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted">{["Txn ID","Order","Customer","Amount","Method","Status","Action"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wide font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id.slice(0, 12)}...</td>
                    <td className="px-4 py-3 text-xs font-medium text-foreground">{t.orderId}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{t.userName}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">₹{t.amount}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{t.method}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "Paid" ? "bg-green-100 text-green-700" : t.status === "Failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{t.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => setDetail(t)} className="p-1.5 rounded-lg border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"><Eye className="w-3.5 h-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-card rounded-2xl w-full max-w-sm shadow-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Transaction Details</h3>
              <button onClick={() => setDetail(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3 text-sm">
              {[["Transaction ID", detail.id], ["Order ID", detail.orderId], ["Customer", detail.userName], ["Amount", `₹${detail.amount}`], ["Method", detail.method], ["Status", detail.status], ["Date", new Date(detail.createdAt).toLocaleString("en-IN")]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium text-foreground text-right max-w-[180px] truncate">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── Notifications Tab ───────────────────────────────────────────────────────
function NotificationsTab() {
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setNotifs(await notifAPI.getByUser("admin")); setLoading(false); };
  useEffect(() => { load(); const u = socket.on("inventory:low", load); return u; }, []);

  return (
    <Section title="Notification Centre" action={
      <button onClick={() => notifAPI.markAllRead("admin").then(load)} className="text-sm text-primary hover:underline">Mark all read</button>
    }>
      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : notifs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><Bell className="w-10 h-10 mx-auto mb-3 opacity-40" /><p>No notifications</p></div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm divide-y divide-border">
          {notifs.map((n) => (
            <div key={n.id} className={`flex gap-3 p-4 ${!n.read ? "bg-primary/3" : ""}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${NOTIF_COLORS[n.type]}`}>
                {n.type === "stock" ? <AlertTriangle className="w-4 h-4" /> : n.type === "order" ? <ShoppingBag className="w-4 h-4" /> : n.type === "payment" ? <CreditCard className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${!n.read ? "font-semibold text-foreground" : "text-foreground"}`}>{n.title}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{new Date(n.createdAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────────────
function SettingsTab() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => { settingsAPI.get().then(setSettings); }, []);

  const showToast = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    await settingsAPI.save(settings);
    setSaving(false);
    showToast("Settings saved successfully!");
  };

  if (!settings) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <Section title="Restaurant Settings">
      <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
        {[
          { key: "restaurantName", label: "Restaurant Name", type: "text" },
          { key: "phone", label: "Phone Number", type: "text" },
          { key: "email", label: "Contact Email", type: "email" },
          { key: "address", label: "Restaurant Address", type: "text" },
          { key: "deliveryFee", label: "Delivery Fee (₹)", type: "number" },
          { key: "freeDeliveryAbove", label: "Free Delivery Above (₹)", type: "number" },
          { key: "razorpayKey", label: "Razorpay Key", type: "text" },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="text-xs text-muted-foreground block mb-1.5">{label}</label>
            <input type={type} value={(settings as Record<string, unknown>)[key] as string}
              onChange={(e) => setSettings((s) => s ? { ...s, [key]: type === "number" ? Number(e.target.value) : e.target.value } : s)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
          </div>
        ))}

        <div className="sm:col-span-2">
          <p className="text-sm font-semibold text-foreground mb-3">Notification Settings</p>
          <div className="flex flex-wrap gap-4">
            {[["enableSMS", "SMS Notifications"], ["enableEmail", "Email Notifications"], ["enablePush", "Push Notifications"]].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={(settings as Record<string, unknown>)[key] as boolean}
                  onChange={(e) => setSettings((s) => s ? { ...s, [key]: e.target.checked } : s)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <button type="submit" disabled={saving}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
            {saving ? <><Spinner /> Saving...</> : "Save Settings"}
          </button>
        </div>
      </form>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </Section>
  );
}

// ─── Admin App Shell ─────────────────────────────────────────────────────────
export function AdminApp() {
  const { logout } = useApp();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [invLow, setInvLow] = useState(0);

  useEffect(() => {
    inventoryAPI.getAll().then((inv) => setInvLow(inv.filter((i) => i.quantity < i.threshold).length));
    const u = socket.on("inventory:low", (d: unknown) => setInvLow(((d as { items: unknown[] }).items ?? []).length));
    return u;
  }, []);

  const NAV = [
    { id: "dashboard", label: "Overview", icon: TrendingUp },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "inventory", label: "Inventory", icon: Package, badge: invLow || undefined },
    { id: "users", label: "Users", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 bg-foreground flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center"><Pizza className="w-4 h-4 text-white" /></div>
            <div>
              <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Pizzeria</p>
              <p className="text-white/40 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setTab(id as AdminTab)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${tab === id ? "bg-primary text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
              <span className="flex items-center gap-3"><Icon className="w-4 h-4" /> {label}</span>
              {badge ? <span className="bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="p-3"><button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"><LogOut className="w-4 h-4" /> Logout</button></div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-foreground capitalize" style={{ fontFamily: "'Playfair Display', serif" }}>
              {NAV.find((n) => n.id === tab)?.label ?? "Dashboard"}
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            {invLow > 0 && <div className="flex items-center gap-1.5 bg-destructive/10 text-destructive px-3 py-1.5 rounded-xl text-xs font-medium"><AlertTriangle className="w-3.5 h-3.5" />{invLow} low stock</div>}
            <button onClick={logout} className="md:hidden flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><LogOut className="w-4 h-4" /></button>
          </div>
        </header>

        {/* Mobile tab bar */}
        <div className="md:hidden flex overflow-x-auto border-b border-border bg-card flex-shrink-0">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as AdminTab)}
              className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors ${tab === id ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "inventory" && <InventoryTab />}
          {tab === "users" && <UsersTab />}
          {tab === "payments" && <PaymentsTab />}
          {tab === "notifications" && <NotificationsTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

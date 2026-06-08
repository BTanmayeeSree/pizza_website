import React, { useEffect, useState } from "react";
import { Package, CheckCircle2, Clock, ChefHat, Bike, MapPin, RefreshCw, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { socket } from "../services/socket";
import type { Order } from "../types";

const STATUS_STEPS = ["Order Received", "In Kitchen", "Out for Delivery", "Delivered"] as const;
const STATUS_ICONS: Record<string, React.ElementType> = {
  "Order Received": Package, "In Kitchen": ChefHat, "Out for Delivery": Bike, "Delivered": MapPin,
};
const STATUS_COLORS: Record<string, string> = {
  "Order Received": "bg-blue-100 text-blue-600",
  "In Kitchen": "bg-amber-100 text-amber-700",
  "Out for Delivery": "bg-orange-100 text-orange-600",
  "Delivered": "bg-green-100 text-green-700",
  "Cancelled": "bg-red-100 text-red-700",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function OrderTrackerModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [current, setCurrent] = useState(order);

  useEffect(() => {
    const unsub = socket.on("order:status", (data: unknown) => {
      const { orderId, status } = data as { orderId: string; status: string };
      if (orderId === order.id) setCurrent((prev) => ({ ...prev, status: status as Order["status"] }));
    });
    return unsub;
  }, [order.id]);

  const stepIdx = STATUS_STEPS.indexOf(current.status as typeof STATUS_STEPS[number]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
      <div className="bg-card rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-primary p-5 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/65 text-xs uppercase tracking-widest">Live Tracking</p>
            <h2 className="text-primary-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{current.id}</h2>
          </div>
          <button onClick={onClose} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-5 bg-secondary rounded-xl px-3 py-2">
            <Clock className="w-4 h-4 text-accent" />
            <p className="text-sm text-foreground">
              {current.status === "Delivered" ? "Order delivered!" : "Estimated delivery in ~<strong>25 min</strong>"}
            </p>
          </div>

          <div className="space-y-0">
            {STATUS_STEPS.map((s, i) => {
              const Icon = STATUS_ICONS[s];
              const done = i <= stepIdx;
              const active = i === stepIdx;
              const isLast = i === STATUS_STEPS.length - 1;
              return (
                <div key={s} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-primary text-primary-foreground" : active ? "bg-accent text-white" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {!isLast && <div className={`w-0.5 h-10 mt-1 ${done && i < stepIdx ? "bg-primary" : "bg-border"}`} />}
                  </div>
                  <div className="pb-8 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{s}</p>
                      {active && <span className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full">Live</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {current.statusHistory.find((h) => h.status === s)
                        ? timeAgo(current.statusHistory.find((h) => h.status === s)!.time)
                        : done ? "Completed" : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="bg-secondary rounded-xl p-3 text-sm">
            <p className="text-xs text-muted-foreground mb-1">Delivering to</p>
            <p className="text-foreground text-xs">{current.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrdersPage() {
  const { userOrders, refreshOrders } = useApp();
  const [loading, setLoading] = useState(false);
  const [trackOrder, setTrackOrder] = useState<Order | null>(null);

  useEffect(() => {
    refresh();
    const unsub = socket.on("order:status", refresh);
    return unsub;
  }, []);

  const refresh = async () => {
    setLoading(true);
    await refreshOrders();
    setLoading(false);
  };

  const active = userOrders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled");
  const past = userOrders.filter((o) => o.status === "Delivered" || o.status === "Cancelled");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>My Orders</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{userOrders.length} total orders</p>
        </div>
        <button onClick={refresh} disabled={loading} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {userOrders.length === 0 && !loading && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground">No orders yet. Start ordering!</p>
        </div>
      )}

      {active.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Active Orders</h3>
          <div className="space-y-3">
            {active.map((order) => <OrderCard key={order.id} order={order} onTrack={() => setTrackOrder(order)} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Past Orders</h3>
          <div className="space-y-3">
            {past.map((order) => <OrderCard key={order.id} order={order} onTrack={() => setTrackOrder(order)} />)}
          </div>
        </div>
      )}

      {trackOrder && <OrderTrackerModal order={trackOrder} onClose={() => setTrackOrder(null)} />}
    </div>
  );
}

function OrderCard({ order, onTrack }: { order: Order; onTrack: () => void }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold text-foreground text-sm">{order.id}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(order.createdAt)}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>{order.status}</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5 bg-secondary rounded-lg px-2.5 py-1">
            <img src={item.image} alt={item.name} className="w-5 h-5 rounded object-cover" />
            <span className="text-xs text-foreground">{item.name} × {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total paid</p>
          <p className="text-primary font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>₹{order.total}</p>
        </div>
        <div className="flex gap-2">
          {order.status === "Delivered" && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
            </span>
          )}
          {order.status !== "Cancelled" && (
            <button onClick={onTrack} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
              Track Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

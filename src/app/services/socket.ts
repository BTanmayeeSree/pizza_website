// Simulates Socket.IO real-time events via browser CustomEvents + intervals

type Handler = (data: unknown) => void;
const listeners: Map<string, Set<Handler>> = new Map();

function emit(event: string, data: unknown) {
  window.dispatchEvent(new CustomEvent("pz_socket:" + event, { detail: data }));
}

export const socket = {
  on(event: string, handler: Handler) {
    const key = "pz_socket:" + event;
    const listener = (e: Event) => handler((e as CustomEvent).detail);
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler);
    window.addEventListener(key, listener as EventListener);
    return () => window.removeEventListener(key, listener as EventListener);
  },
  emit,
};

const ORDER_STATUSES = ["Order Received", "In Kitchen", "Out for Delivery", "Delivered"] as const;
let simulatorActive = false;

export function startSocketSimulator() {
  if (simulatorActive) return;
  simulatorActive = true;

  // Simulate live order status progression every 30s
  setInterval(() => {
    const orders = JSON.parse(localStorage.getItem("pz_orders") || "[]");
    const active = orders.filter((o: { status: string }) =>
      ["Order Received", "In Kitchen", "Out for Delivery"].includes(o.status)
    );
    if (active.length === 0) return;
    const pick = active[Math.floor(Math.random() * active.length)];
    const idx = ORDER_STATUSES.indexOf(pick.status as typeof ORDER_STATUSES[number]);
    if (idx >= ORDER_STATUSES.length - 1) return;
    const nextStatus = ORDER_STATUSES[idx + 1];
    const updated = orders.map((o: { id: string; statusHistory: unknown[] }) =>
      o.id === pick.id
        ? { ...o, status: nextStatus, statusHistory: [...(o.statusHistory ?? []), { status: nextStatus, time: new Date().toISOString() }] }
        : o
    );
    localStorage.setItem("pz_orders", JSON.stringify(updated));
    emit("order:status", { orderId: pick.id, status: nextStatus });
    emit("dashboard:refresh", {});
  }, 30000);

  // Simulate live inventory updates every 45s
  setInterval(() => {
    const inv = JSON.parse(localStorage.getItem("pz_inventory") || "[]");
    const lowStock = inv.filter((i: { quantity: number; threshold: number }) => i.quantity < i.threshold);
    if (lowStock.length) emit("inventory:low", { items: lowStock });
    emit("inventory:update", { inventory: inv });
  }, 45000);

  // Simulate new order coming in every 60s
  setInterval(() => {
    emit("dashboard:refresh", { metric: "orders" });
  }, 60000);
}

import type {
  User, Ingredient, Order, Transaction, AppNotification,
  InventoryItem, Settings, CartItem, OrderStatus
} from "../types";

const delay = (ms = 450) => new Promise<void>((r) => setTimeout(r, ms));

function get<T>(key: string): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") as T; } catch { return null as T; }
}
function set(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)); }

// ─── Seed Data ──────────────────────────────────────────────────────────────

const SEED_USERS: User[] = [
  {
    id: "u1", name: "Rahul Sharma", email: "user@pizzeria.in", phone: "9876543210",
    role: "user", verified: true, blocked: false,
    addresses: [
      { id: "a1", label: "Home", line1: "42, Andheri West", city: "Mumbai", pincode: "400053", isDefault: true },
      { id: "a2", label: "Office", line1: "Floor 5, BKC Tower", city: "Mumbai", pincode: "400051", isDefault: false },
    ],
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "u2", name: "Priya Verma", email: "priya@example.in", phone: "9123456789",
    role: "user", verified: true, blocked: false,
    addresses: [{ id: "a3", label: "Home", line1: "12, Connaught Place", city: "Delhi", pincode: "110001", isDefault: true }],
    createdAt: "2026-02-14T09:00:00Z",
  },
  {
    id: "u3", name: "Arjun Singh", email: "arjun@example.in", phone: "9988776655",
    role: "user", verified: false, blocked: false,
    addresses: [],
    createdAt: "2026-03-05T11:30:00Z",
  },
  {
    id: "admin1", name: "Admin User", email: "admin@pizzeria.in", phone: "9000000001",
    role: "admin", verified: true, blocked: false,
    addresses: [],
    createdAt: "2026-01-01T00:00:00Z",
  },
];

const SEED_PASSWORDS: Record<string, string> = {
  "user@pizzeria.in": "user123",
  "priya@example.in": "priya123",
  "arjun@example.in": "arjun123",
  "admin@pizzeria.in": "admin123",
};

const SEED_INGREDIENTS: Ingredient[] = [
  { id: "b1", name: "Thin Crust",    category: "base",   price: 0,   inStock: true,  quantity: 50, threshold: 10 },
  { id: "b2", name: "Cheese Burst",  category: "base",   price: 50,  inStock: true,  quantity: 30, threshold: 8  },
  { id: "b3", name: "Pan Pizza",     category: "base",   price: 40,  inStock: true,  quantity: 25, threshold: 8  },
  { id: "b4", name: "Wheat Base",    category: "base",   price: 30,  inStock: true,  quantity: 20, threshold: 5  },
  { id: "b5", name: "Stuffed Crust", category: "base",   price: 80,  inStock: false, quantity: 3,  threshold: 8  },
  { id: "s1", name: "Tomato",        category: "sauce",  price: 0,   inStock: true,  quantity: 40, threshold: 10 },
  { id: "s2", name: "BBQ",           category: "sauce",  price: 20,  inStock: true,  quantity: 25, threshold: 8  },
  { id: "s3", name: "Garlic",        category: "sauce",  price: 20,  inStock: true,  quantity: 20, threshold: 5  },
  { id: "s4", name: "Alfredo",       category: "sauce",  price: 30,  inStock: true,  quantity: 15, threshold: 5  },
  { id: "s5", name: "Pesto",         category: "sauce",  price: 30,  inStock: true,  quantity: 10, threshold: 5  },
  { id: "c1", name: "Mozzarella",    category: "cheese", price: 0,   inStock: true,  quantity: 60, threshold: 15 },
  { id: "c2", name: "Cheddar",       category: "cheese", price: 20,  inStock: true,  quantity: 8,  threshold: 10 },
  { id: "c3", name: "Parmesan",      category: "cheese", price: 30,  inStock: true,  quantity: 12, threshold: 8  },
  { id: "v1", name: "Onion",         category: "veggie", price: 15,  inStock: true,  quantity: 35, threshold: 10 },
  { id: "v2", name: "Capsicum",      category: "veggie", price: 15,  inStock: true,  quantity: 28, threshold: 10 },
  { id: "v3", name: "Mushroom",      category: "veggie", price: 25,  inStock: true,  quantity: 20, threshold: 8  },
  { id: "v4", name: "Corn",          category: "veggie", price: 15,  inStock: true,  quantity: 22, threshold: 5  },
  { id: "v5", name: "Olive",         category: "veggie", price: 25,  inStock: true,  quantity: 4,  threshold: 8  },
  { id: "m1", name: "Chicken",       category: "meat",   price: 50,  inStock: true,  quantity: 25, threshold: 10 },
  { id: "m2", name: "Pepperoni",     category: "meat",   price: 50,  inStock: true,  quantity: 9,  threshold: 10 },
  { id: "m3", name: "Sausage",       category: "meat",   price: 40,  inStock: true,  quantity: 15, threshold: 8  },
];

const SEED_INVENTORY: InventoryItem[] = [
  { id: "i1", name: "Mozzarella Cheese", category: "Cheese", quantity: 60, threshold: 15, unit: "kg" },
  { id: "i2", name: "Pepperoni",         category: "Meat",   quantity: 9,  threshold: 10, unit: "kg" },
  { id: "i3", name: "Tomato Sauce",      category: "Sauce",  quantity: 40, threshold: 10, unit: "L"  },
  { id: "i4", name: "Pizza Dough",       category: "Base",   quantity: 3,  threshold: 8,  unit: "kg" },
  { id: "i5", name: "Capsicum",          category: "Veggie", quantity: 28, threshold: 10, unit: "kg" },
  { id: "i6", name: "Cheddar Cheese",    category: "Cheese", quantity: 8,  threshold: 10, unit: "kg" },
  { id: "i7", name: "Chicken Strips",    category: "Meat",   quantity: 25, threshold: 10, unit: "kg" },
  { id: "i8", name: "Olive Oil",         category: "Other",  quantity: 12, threshold: 5,  unit: "L"  },
];

function makeOrder(id: string, userId: string, userName: string, email: string, status: OrderStatus, days: number): Order {
  const d = new Date(Date.now() - days * 86400000);
  const items: CartItem[] = [
    { id: "ci1", pizzaId: 2, name: "Pepperoni Royale", base: "Thin Crust", sauce: "Tomato", cheese: "Mozzarella", veggies: [], meats: ["Pepperoni"], price: 499, quantity: 1, image: "https://images.unsplash.com/photo-1592229005296-735b0f6c0722?w=600&h=400&fit=crop&auto=format" },
  ];
  const subtotal = 499;
  const delivery = 49;
  return {
    id, userId, userName, userEmail: email, items, subtotal, delivery, total: subtotal + delivery,
    status, paymentStatus: "Paid", paymentId: `pay_${id}`, address: "42, Andheri West, Mumbai - 400053",
    createdAt: d.toISOString(),
    statusHistory: [{ status: "Order Received", time: d.toISOString() }],
  };
}

const SEED_ORDERS: Order[] = [
  makeOrder("PZ-20481", "u1", "Rahul Sharma", "user@pizzeria.in", "Delivered", 3),
  makeOrder("PZ-20482", "u2", "Priya Verma",  "priya@example.in", "Delivered", 2),
  makeOrder("PZ-20483", "u1", "Rahul Sharma", "user@pizzeria.in", "Out for Delivery", 0),
  makeOrder("PZ-20484", "u2", "Priya Verma",  "priya@example.in", "In Kitchen", 0),
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: "txn_01", orderId: "PZ-20481", userId: "u1", userName: "Rahul Sharma", amount: 548, status: "Paid",  method: "UPI",       createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "txn_02", orderId: "PZ-20482", userId: "u2", userName: "Priya Verma",  amount: 548, status: "Paid",  method: "Credit Card", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "txn_03", orderId: "PZ-20483", userId: "u1", userName: "Rahul Sharma", amount: 548, status: "Paid",  method: "UPI",       createdAt: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: "txn_04", orderId: "PZ-20484", userId: "u2", userName: "Priya Verma",  amount: 548, status: "Paid",  method: "Debit Card", createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", userId: "u1",   type: "order",   title: "Order Confirmed",    message: "Your order PZ-20483 has been confirmed.", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "n2", userId: "u1",   type: "payment", title: "Payment Successful", message: "₹548 paid via UPI for PZ-20483.",          read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "n3", userId: "admin",type: "stock",   title: "Low Stock Alert",    message: "Pepperoni is below threshold (9 kg left).",  read: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: "n4", userId: "admin",type: "order",   title: "New Order Received", message: "PZ-20484 placed by Priya Verma — ₹548.",   read: false, createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
];

const DEFAULT_SETTINGS: Settings = {
  restaurantName: "Pizzeria", phone: "+91 98765 43210",
  email: "hello@pizzeria.in", address: "MG Road, Bangalore - 560001",
  deliveryFee: 49, freeDeliveryAbove: 499,
  razorpayKey: "rzp_test_XXXXXXXXXX",
  enableSMS: true, enableEmail: true, enablePush: true,
};

// ─── Initialize ─────────────────────────────────────────────────────────────

export function initStore() {
  if (localStorage.getItem("pz_v2")) return;
  set("pz_users", SEED_USERS);
  set("pz_passwords", SEED_PASSWORDS);
  set("pz_ingredients", SEED_INGREDIENTS);
  set("pz_inventory", SEED_INVENTORY);
  set("pz_orders", SEED_ORDERS);
  set("pz_transactions", SEED_TRANSACTIONS);
  set("pz_notifications", SEED_NOTIFICATIONS);
  set("pz_cart", []);
  set("pz_settings", DEFAULT_SETTINGS);
  localStorage.setItem("pz_v2", "1");
}

// ─── Auth API ────────────────────────────────────────────────────────────────

export const authAPI = {
  async login(email: string, password: string) {
    await delay();
    const users = get<User[]>("pz_users") ?? [];
    const passwords = get<Record<string, string>>("pz_passwords") ?? {};
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("No account found with this email.");
    if (passwords[email] !== password) throw new Error("Incorrect password.");
    if (user.blocked) throw new Error("Your account has been blocked. Contact support.");
    const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 * 7 }));
    localStorage.setItem("pz_token", token);
    return { user, token };
  },
  async register(name: string, email: string, password: string, phone: string) {
    await delay();
    const users = get<User[]>("pz_users") ?? [];
    if (users.find((u) => u.email === email)) throw new Error("Email already registered.");
    const newUser: User = {
      id: "u" + Date.now(), name, email, phone, role: "user",
      verified: false, blocked: false, addresses: [],
      createdAt: new Date().toISOString(),
    };
    const passwords = get<Record<string, string>>("pz_passwords") ?? {};
    users.push(newUser);
    passwords[email] = password;
    set("pz_users", users);
    set("pz_passwords", passwords);
    return { user: newUser, message: "Verification email sent to " + email };
  },
  async forgotPassword(email: string) {
    await delay();
    const users = get<User[]>("pz_users") ?? [];
    if (!users.find((u) => u.email === email)) throw new Error("No account found with this email.");
    return { message: "Password reset link sent to " + email, token: btoa(email + ":reset") };
  },
  async resetPassword(token: string, password: string) {
    await delay();
    const email = atob(token).split(":")[0];
    const passwords = get<Record<string, string>>("pz_passwords") ?? {};
    if (!passwords[email]) throw new Error("Invalid reset token.");
    passwords[email] = password;
    set("pz_passwords", passwords);
    return { message: "Password reset successfully. Please login." };
  },
  async verifyEmail(userId: string) {
    await delay();
    const users = get<User[]>("pz_users") ?? [];
    const updated = users.map((u) => u.id === userId ? { ...u, verified: true } : u);
    set("pz_users", updated);
    return { message: "Email verified successfully!" };
  },
  getSession(): User | null {
    const token = localStorage.getItem("pz_token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) { localStorage.removeItem("pz_token"); return null; }
      const users = get<User[]>("pz_users") ?? [];
      return users.find((u) => u.id === payload.id) ?? null;
    } catch { return null; }
  },
  logout() { localStorage.removeItem("pz_token"); },
};

// ─── Pizza / Ingredient API ──────────────────────────────────────────────────

export const ingredientAPI = {
  async getAll() {
    await delay(300);
    return get<Ingredient[]>("pz_ingredients") ?? [];
  },
};

// ─── Cart API ────────────────────────────────────────────────────────────────

export const cartAPI = {
  async get() { await delay(200); return get<CartItem[]>("pz_cart") ?? []; },
  async add(item: CartItem) {
    await delay(300);
    const cart = get<CartItem[]>("pz_cart") ?? [];
    const exists = cart.find((c) => c.id === item.id);
    const updated = exists ? cart.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c) : [...cart, item];
    set("pz_cart", updated);
    return updated;
  },
  async updateQty(itemId: string, qty: number) {
    await delay(200);
    const cart = get<CartItem[]>("pz_cart") ?? [];
    const updated = qty <= 0 ? cart.filter((c) => c.id !== itemId) : cart.map((c) => c.id === itemId ? { ...c, quantity: qty } : c);
    set("pz_cart", updated);
    return updated;
  },
  async remove(itemId: string) {
    await delay(200);
    const cart = (get<CartItem[]>("pz_cart") ?? []).filter((c) => c.id !== itemId);
    set("pz_cart", cart);
    return cart;
  },
  async clear() { await delay(200); set("pz_cart", []); return []; },
};

// ─── Order API ───────────────────────────────────────────────────────────────

export const orderAPI = {
  async create(order: Omit<Order, "id" | "createdAt" | "statusHistory">) {
    await delay(600);
    const orders = get<Order[]>("pz_orders") ?? [];
    const id = "PZ-" + (20480 + orders.length + 1);
    const now = new Date().toISOString();
    const newOrder: Order = { ...order, id, createdAt: now, statusHistory: [{ status: "Order Received", time: now }] };
    orders.unshift(newOrder);
    set("pz_orders", orders);
    // Add transaction
    const txns = get<Transaction[]>("pz_transactions") ?? [];
    txns.unshift({ id: "txn_" + Date.now(), orderId: id, userId: order.userId, userName: order.userName, amount: order.total, status: "Paid", method: order.paymentId.includes("upi") ? "UPI" : "Card", createdAt: now });
    set("pz_transactions", txns);
    // Notification
    addNotif(order.userId, "order", "Order Confirmed 🎉", `Your order ${id} is confirmed!`);
    addNotif("admin", "order", "New Order", `${order.userName} placed ${id} — ₹${order.total}`);
    return newOrder;
  },
  async getByUser(userId: string) {
    await delay(400);
    return (get<Order[]>("pz_orders") ?? []).filter((o) => o.userId === userId);
  },
  async getById(id: string) {
    await delay(300);
    return (get<Order[]>("pz_orders") ?? []).find((o) => o.id === id) ?? null;
  },
  async getAll() { await delay(400); return get<Order[]>("pz_orders") ?? []; },
  async updateStatus(orderId: string, status: OrderStatus) {
    await delay(400);
    const orders = get<Order[]>("pz_orders") ?? [];
    const now = new Date().toISOString();
    const updated = orders.map((o) => o.id === orderId
      ? { ...o, status, statusHistory: [...o.statusHistory, { status, time: now }] }
      : o
    );
    set("pz_orders", updated);
    const order = updated.find((o) => o.id === orderId);
    if (order) addNotif(order.userId, "order", "Order Update", `Your order ${orderId} is now: ${status}`);
    return updated.find((o) => o.id === orderId) ?? null;
  },
};

// ─── Inventory API ───────────────────────────────────────────────────────────

export const inventoryAPI = {
  async getAll() { await delay(300); return get<InventoryItem[]>("pz_inventory") ?? []; },
  async add(item: Omit<InventoryItem, "id">) {
    await delay(400);
    const inv = get<InventoryItem[]>("pz_inventory") ?? [];
    const newItem = { ...item, id: "i" + Date.now() };
    inv.push(newItem);
    set("pz_inventory", inv);
    return inv;
  },
  async update(id: string, data: Partial<InventoryItem>) {
    await delay(400);
    const inv = (get<InventoryItem[]>("pz_inventory") ?? []).map((i) => i.id === id ? { ...i, ...data } : i);
    set("pz_inventory", inv);
    return inv;
  },
  async delete(id: string) {
    await delay(400);
    const inv = (get<InventoryItem[]>("pz_inventory") ?? []).filter((i) => i.id !== id);
    set("pz_inventory", inv);
    return inv;
  },
};

// ─── User API ────────────────────────────────────────────────────────────────

export const userAPI = {
  async getAll() { await delay(400); return get<User[]>("pz_users") ?? []; },
  async getById(id: string) { await delay(300); return (get<User[]>("pz_users") ?? []).find((u) => u.id === id) ?? null; },
  async updateProfile(userId: string, data: Partial<User>) {
    await delay(400);
    const users = (get<User[]>("pz_users") ?? []).map((u) => u.id === userId ? { ...u, ...data } : u);
    set("pz_users", users);
    return users.find((u) => u.id === userId)!;
  },
  async changePassword(userId: string, currentPass: string, newPass: string) {
    await delay(500);
    const users = get<User[]>("pz_users") ?? [];
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    const passwords = get<Record<string, string>>("pz_passwords") ?? {};
    if (passwords[user.email] !== currentPass) throw new Error("Current password is incorrect.");
    passwords[user.email] = newPass;
    set("pz_passwords", passwords);
    return { message: "Password changed successfully." };
  },
  async block(userId: string, blocked: boolean) {
    await delay(400);
    const users = (get<User[]>("pz_users") ?? []).map((u) => u.id === userId ? { ...u, blocked } : u);
    set("pz_users", users);
    return users;
  },
  async delete(userId: string) {
    await delay(400);
    const users = (get<User[]>("pz_users") ?? []).filter((u) => u.id !== userId);
    set("pz_users", users);
    return users;
  },
};

// ─── Notification API ────────────────────────────────────────────────────────

function addNotif(userId: string, type: AppNotification["type"], title: string, message: string) {
  const notifs = get<AppNotification[]>("pz_notifications") ?? [];
  notifs.unshift({ id: "n" + Date.now(), userId, type, title, message, read: false, createdAt: new Date().toISOString() });
  set("pz_notifications", notifs);
}

export const notifAPI = {
  async getByUser(userId: string) {
    await delay(200);
    const isAdmin = userId === "admin";
    return (get<AppNotification[]>("pz_notifications") ?? []).filter((n) =>
      isAdmin ? n.userId === "admin" : n.userId === userId
    );
  },
  async markRead(id: string) {
    await delay(100);
    const notifs = (get<AppNotification[]>("pz_notifications") ?? []).map((n) => n.id === id ? { ...n, read: true } : n);
    set("pz_notifications", notifs);
  },
  async markAllRead(userId: string) {
    await delay(200);
    const notifs = (get<AppNotification[]>("pz_notifications") ?? []).map((n) =>
      n.userId === userId || (userId === "admin" && n.userId === "admin") ? { ...n, read: true } : n
    );
    set("pz_notifications", notifs);
  },
  addNotif,
};

// ─── Transaction API ─────────────────────────────────────────────────────────

export const txnAPI = {
  async getAll() { await delay(400); return get<Transaction[]>("pz_transactions") ?? []; },
  async getById(id: string) { await delay(300); return (get<Transaction[]>("pz_transactions") ?? []).find((t) => t.id === id) ?? null; },
};

// ─── Settings API ────────────────────────────────────────────────────────────

export const settingsAPI = {
  async get() { await delay(200); return get<Settings>("pz_settings") ?? DEFAULT_SETTINGS; },
  async save(data: Partial<Settings>) {
    await delay(400);
    const current = get<Settings>("pz_settings") ?? DEFAULT_SETTINGS;
    const updated = { ...current, ...data };
    set("pz_settings", updated);
    return updated;
  },
};

// ─── Analytics API ───────────────────────────────────────────────────────────

export const analyticsAPI = {
  async get() {
    await delay(500);
    const orders = get<Order[]>("pz_orders") ?? [];
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 86400000);
      const dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      const dayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === d.toDateString());
      return { date: dateStr, revenue: dayOrders.reduce((s, o) => s + o.total, 0), orders: dayOrders.length };
    });
    const topPizzas = [
      { name: "Pepperoni", count: 42 },
      { name: "Margherita", count: 38 },
      { name: "BBQ Chicken", count: 29 },
      { name: "Four Cheese", count: 25 },
      { name: "Garden Veggie", count: 18 },
    ];
    return { last7, topPizzas, totalRevenue: orders.reduce((s, o) => s + o.total, 0), totalOrders: orders.length };
  },
};

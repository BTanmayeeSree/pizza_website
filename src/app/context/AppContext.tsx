import { createContext, useContext, useEffect, useReducer, useCallback, useState } from "react";
import type { User, CartItem, AppNotification, Order } from "../types";
import { authAPI, cartAPI, notifAPI, orderAPI } from "../services/store";
import { socket } from "../services/socket";

// ─── State ───────────────────────────────────────────────────────────────────

interface AppState {
  user: User | null;
  authLoading: boolean;
  cart: CartItem[];
  cartLoading: boolean;
  notifications: AppNotification[];
  currentOrder: Order | null;
  page: string;
  subPage: string;
}

type Action =
  | { type: "SET_USER"; user: User | null }
  | { type: "AUTH_LOADING"; loading: boolean }
  | { type: "SET_CART"; cart: CartItem[] }
  | { type: "CART_LOADING"; loading: boolean }
  | { type: "SET_NOTIFS"; notifs: AppNotification[] }
  | { type: "SET_PAGE"; page: string; subPage?: string }
  | { type: "SET_ORDER"; order: Order | null };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_USER": return { ...state, user: action.user };
    case "AUTH_LOADING": return { ...state, authLoading: action.loading };
    case "SET_CART": return { ...state, cart: action.cart, cartLoading: false };
    case "CART_LOADING": return { ...state, cartLoading: action.loading };
    case "SET_NOTIFS": return { ...state, notifications: action.notifs };
    case "SET_PAGE": return { ...state, page: action.page, subPage: action.subPage ?? "" };
    case "SET_ORDER": return { ...state, currentOrder: action.order };
    default: return state;
  }
}

const initial: AppState = {
  user: null, authLoading: true, cart: [], cartLoading: false,
  notifications: [], currentOrder: null, page: "auth", subPage: "",
};

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextValue extends AppState {
  // Auth
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<{ message: string }>;
  logout: () => void;
  // Cart
  addToCart: (item: CartItem) => Promise<void>;
  updateCartQty: (id: string, qty: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  // Nav
  navigate: (page: string, subPage?: string) => void;
  // Notifications
  refreshNotifs: () => Promise<void>;
  markNotifRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  // Orders
  setCurrentOrder: (order: Order | null) => void;
  refreshOrders: () => Promise<void>;
  userOrders: Order[];
}

const AppContext = createContext<AppContextValue>(null!);
export const useApp = () => useContext(AppContext);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Restore session on mount
  useEffect(() => {
    const user = authAPI.getSession();
    dispatch({ type: "SET_USER", user });
    dispatch({ type: "AUTH_LOADING", loading: false });
    if (user) {
      dispatch({ type: "SET_PAGE", page: user.role === "admin" ? "admin" : "home" });
      loadCart();
      loadNotifs(user);
      loadOrders(user);
    } else {
      dispatch({ type: "SET_PAGE", page: "auth" });
    }
  }, []);

  // Socket subscriptions
  useEffect(() => {
    const unsub1 = socket.on("order:status", () => { if (state.user) loadOrders(state.user); });
    const unsub2 = socket.on("inventory:low", () => loadNotifs(state.user!));
    return () => { unsub1(); unsub2(); };
  }, [state.user]);

  const loadCart = useCallback(async () => {
    const cart = await cartAPI.get();
    dispatch({ type: "SET_CART", cart });
  }, []);

  const loadNotifs = useCallback(async (user: User | null) => {
    if (!user) return;
    const notifs = await notifAPI.getByUser(user.role === "admin" ? "admin" : user.id);
    dispatch({ type: "SET_NOTIFS", notifs });
  }, []);

  const loadOrders = useCallback(async (user: User) => {
    if (user.role !== "user") return;
    const orders = await orderAPI.getByUser(user.id);
    setUserOrders(orders);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: "AUTH_LOADING", loading: true });
    try {
      const { user } = await authAPI.login(email, password);
      dispatch({ type: "SET_USER", user });
      dispatch({ type: "SET_PAGE", page: user.role === "admin" ? "admin" : "home" });
      await loadCart();
      await loadNotifs(user);
      if (user.role === "user") await loadOrders(user);
    } finally {
      dispatch({ type: "AUTH_LOADING", loading: false });
    }
  }, [loadCart, loadNotifs, loadOrders]);

  const register = useCallback(async (name: string, email: string, password: string, phone: string) => {
    return authAPI.register(name, email, password, phone);
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    dispatch({ type: "SET_USER", user: null });
    dispatch({ type: "SET_CART", cart: [] });
    dispatch({ type: "SET_NOTIFS", notifs: [] });
    dispatch({ type: "SET_PAGE", page: "auth" });
  }, []);

  const addToCart = useCallback(async (item: CartItem) => {
    dispatch({ type: "CART_LOADING", loading: true });
    const cart = await cartAPI.add(item);
    dispatch({ type: "SET_CART", cart });
  }, []);

  const updateCartQty = useCallback(async (id: string, qty: number) => {
    const cart = await cartAPI.updateQty(id, qty);
    dispatch({ type: "SET_CART", cart });
  }, []);

  const removeFromCart = useCallback(async (id: string) => {
    const cart = await cartAPI.remove(id);
    dispatch({ type: "SET_CART", cart });
  }, []);

  const clearCart = useCallback(async () => {
    await cartAPI.clear();
    dispatch({ type: "SET_CART", cart: [] });
  }, []);

  const navigate = useCallback((page: string, subPage = "") => {
    dispatch({ type: "SET_PAGE", page, subPage });
  }, []);

  const refreshNotifs = useCallback(async () => {
    if (state.user) await loadNotifs(state.user);
  }, [state.user, loadNotifs]);

  const markNotifRead = useCallback(async (id: string) => {
    await notifAPI.markRead(id);
    await refreshNotifs();
  }, [refreshNotifs]);

  const markAllRead = useCallback(async () => {
    if (!state.user) return;
    await notifAPI.markAllRead(state.user.role === "admin" ? "admin" : state.user.id);
    await refreshNotifs();
  }, [state.user, refreshNotifs]);

  const setCurrentOrder = useCallback((order: Order | null) => {
    dispatch({ type: "SET_ORDER", order });
  }, []);

  const refreshOrders = useCallback(async () => {
    if (state.user) await loadOrders(state.user);
  }, [state.user, loadOrders]);

  return (
    <AppContext.Provider value={{
      ...state,
      login, register, logout,
      addToCart, updateCartQty, removeFromCart, clearCart,
      navigate, refreshNotifs, markNotifRead, markAllRead,
      setCurrentOrder, refreshOrders, userOrders,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Extra helpers exposed via hook
export function useCartCount() {
  const { cart } = useApp();
  return cart.reduce((s, i) => s + i.quantity, 0);
}

export function useUnreadCount() {
  const { notifications } = useApp();
  return notifications.filter((n) => !n.read).length;
}

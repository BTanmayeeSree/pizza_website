export type UserRole = "user" | "admin";
export type OrderStatus = "Order Received" | "In Kitchen" | "Out for Delivery" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Failed";
export type NotifType = "order" | "payment" | "stock" | "system";
export type AdminTab = "dashboard" | "orders" | "inventory" | "users" | "payments" | "notifications" | "settings";

export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  blocked: boolean;
  addresses: Address[];
  createdAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: "base" | "sauce" | "cheese" | "veggie" | "meat";
  price: number;
  inStock: boolean;
  quantity: number;
  threshold: number;
}

export interface Pizza {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  isVeg: boolean;
}

export interface CartItem {
  id: string;
  pizzaId: number;
  name: string;
  base: string;
  sauce: string;
  cheese: string;
  veggies: string[];
  meats: string[];
  price: number;
  quantity: number;
  image: string;
}

export interface StatusEntry {
  status: string;
  time: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId: string;
  address: string;
  createdAt: string;
  statusHistory: StatusEntry[];
}

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotifType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  unit: string;
}

export interface Settings {
  restaurantName: string;
  phone: string;
  email: string;
  address: string;
  deliveryFee: number;
  freeDeliveryAbove: number;
  razorpayKey: string;
  enableSMS: boolean;
  enableEmail: boolean;
  enablePush: boolean;
}

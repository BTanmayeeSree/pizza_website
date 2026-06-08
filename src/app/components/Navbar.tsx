import { useState } from "react";
import { Pizza, ShoppingCart, Bell, LogOut, User, Package, ChevronDown } from "lucide-react";
import { useApp, useCartCount, useUnreadCount } from "../context/AppContext";
import { NotificationCenter } from "./NotificationCenter";

export function Navbar() {
  const { user, navigate, logout, page } = useApp();
  const cartCount = useCartCount();
  const unreadCount = useUnreadCount();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Menu" },
    { id: "orders", label: "My Orders" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => navigate("home")} className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Pizza className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-foreground hidden sm:block" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
              Pizzeria
            </span>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${page === item.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Bell className="w-4.5 h-4.5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("cart")}
              className="relative flex items-center gap-1.5 bg-primary text-primary-foreground px-3.5 py-2 rounded-full hover:opacity-90 transition-opacity shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">{user?.name[0]}</span>
                </div>
                <span className="text-sm text-foreground max-w-[80px] truncate">{user?.name.split(" ")[0]}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl w-44 py-1 z-50">
                  <button onClick={() => { navigate("profile"); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    <User className="w-4 h-4 text-muted-foreground" /> Profile
                  </button>
                  <button onClick={() => { navigate("orders"); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    <Package className="w-4 h-4 text-muted-foreground" /> My Orders
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button onClick={logout} className="md:hidden w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-colors">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden flex border-t border-border bg-card">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex-1 py-2.5 text-xs transition-colors ${page === item.id ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {notifOpen && <NotificationCenter onClose={() => setNotifOpen(false)} />}
    </>
  );
}

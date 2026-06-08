import { useEffect, useState } from "react";
import { ShoppingBag, Plus, Minus, X, ArrowRight, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";

function Spinner() { return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />; }

export function CartPage() {
  const { cart, updateCartQty, removeFromCart, clearCart, navigate, cartLoading } = useApp();
  const [updating, setUpdating] = useState<string | null>(null);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const settings = { deliveryFee: 49, freeDeliveryAbove: 499 };
  const delivery = subtotal >= settings.freeDeliveryAbove ? 0 : settings.deliveryFee;
  const total = subtotal + delivery;

  const handleQty = async (id: string, qty: number) => {
    setUpdating(id);
    await updateCartQty(id, qty);
    setUpdating(null);
  };

  const handleRemove = async (id: string) => {
    setUpdating(id);
    await removeFromCart(id);
    setUpdating(null);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-9 h-9 text-muted-foreground" />
        </div>
        <h2 className="text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mb-6">Add some delicious pizzas to get started!</p>
        <button onClick={() => navigate("home")} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>Your Cart</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{cart.length} item{cart.length > 1 ? "s" : ""} selected</p>
        </div>
        <button onClick={() => clearCart()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-4 h-4" /> Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl border border-border p-4 flex gap-4 shadow-sm">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {[item.base, item.sauce + " sauce", item.cheese, ...item.veggies, ...item.meats].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <button onClick={() => handleRemove(item.id)} disabled={updating === item.id}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                    {updating === item.id ? <Spinner /> : <X className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleQty(item.id, item.quantity - 1)} disabled={updating === item.id}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold text-foreground w-6 text-center">{item.quantity}</span>
                    <button onClick={() => handleQty(item.id, item.quantity + 1)} disabled={updating === item.id}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-primary font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm sticky top-20">
            <h3 className="text-foreground font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                {delivery === 0 ? <span className="text-green-600 font-medium">FREE</span> : <span>₹{delivery}</span>}
              </div>
              {subtotal < settings.freeDeliveryAbove && (
                <div className="bg-secondary rounded-xl px-3 py-2 text-xs text-muted-foreground">
                  Add ₹{settings.freeDeliveryAbove - subtotal} more for <strong className="text-green-600">FREE delivery</strong>
                </div>
              )}
              <div className="border-t border-border pt-2.5 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem" }}>₹{total}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Coupon code (PIZZA3)"
                className="w-full pr-32 px-4 py-3 rounded-2xl bg-muted/80 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent transition-shadow"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 rounded-full border border-primary text-primary text-sm bg-white/95 shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Apply
              </button>
            </div>

            <button onClick={() => navigate("checkout")}
              className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>🔒 Secure checkout via Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { CheckCircle2, XCircle, CreditCard, Smartphone, Building2, ArrowLeft, MapPin, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { orderAPI } from "../services/store";
import type { Order } from "../types";

type CheckoutStep = "address" | "payment" | "processing" | "success" | "failure";
type PayMethod = "upi" | "card" | "netbanking";

function Spinner() { return <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />; }

export function CheckoutPage() {
  const { user, cart, clearCart, navigate, setCurrentOrder } = useApp();
  const [step, setStep] = useState<CheckoutStep>("address");
  const [payMethod, setPayMethod] = useState<PayMethod>("upi");
  const [upiId, setUpiId] = useState("rahul@upi");
  const [cardNo, setCardNo] = useState("4111 1111 1111 1111");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [cardName, setCardName] = useState(user?.name ?? "");
  const [selectedAddr, setSelectedAddr] = useState(user?.addresses?.[0]?.id ?? "");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery;

  const defaultAddr = user?.addresses?.find((a) => a.id === selectedAddr) ?? user?.addresses?.[0];
  const addrStr = defaultAddr ? `${defaultAddr.line1}, ${defaultAddr.city} - ${defaultAddr.pincode}` : "No address saved. Go to Profile → Addresses.";

  const handlePayment = async () => {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2200));

    // Simulate 90% success rate
    const success = Math.random() > 0.1;
    if (!success) { setStep("failure"); return; }

    const payId = payMethod === "upi" ? `upi_${Date.now()}` : payMethod === "card" ? `card_${Date.now()}` : `nb_${Date.now()}`;
    try {
      const order = await orderAPI.create({
        userId: user!.id, userName: user!.name, userEmail: user!.email,
        items: cart, subtotal, delivery, total,
        status: "Order Received", paymentStatus: "Paid",
        paymentId: payId, address: addrStr,
      });
      await clearCart();
      setCreatedOrder(order);
      setCurrentOrder(order);
      setStep("success");
    } catch {
      setStep("failure");
    }
  };

  // ── PROCESSING ──
  if (step === "processing") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Spinner />
        </div>
        <h2 className="text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>Processing Payment</h2>
        <p className="text-muted-foreground text-sm">Please wait, do not refresh...</p>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" /> Secured by Razorpay
        </div>
      </div>
    );
  }

  // ── SUCCESS ──
  if (step === "success" && createdOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>Order Placed! 🎉</h2>
        <p className="text-muted-foreground mb-1">Order ID: <strong className="text-foreground">{createdOrder.id}</strong></p>
        <p className="text-muted-foreground text-sm mb-2">Amount paid: <strong className="text-primary">₹{createdOrder.total}</strong></p>
        <p className="text-muted-foreground text-sm mb-8">Your pizza is heading to the kitchen. Estimated delivery: <strong className="text-foreground">30 min</strong></p>

        <div className="bg-card border border-border rounded-2xl p-5 max-w-sm w-full text-left mb-6 shadow-sm">
          <h4 className="font-semibold text-foreground mb-3">Order Summary</h4>
          {createdOrder.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
              <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
              <span className="text-foreground font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-2 mt-1 font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>₹{createdOrder.total}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate("orders")} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
            Track Order
          </button>
          <button onClick={() => navigate("home")} className="border border-border text-foreground px-6 py-2.5 rounded-full text-sm hover:border-primary transition-colors">
            Order More
          </button>
        </div>
      </div>
    );
  }

  // ── FAILURE ──
  if (step === "failure") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>Payment Failed</h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs">Your payment could not be processed. No amount was deducted. Please try again.</p>
        <div className="flex gap-3">
          <button onClick={() => setStep("payment")} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
            Try Again
          </button>
          <button onClick={() => navigate("cart")} className="border border-border text-foreground px-6 py-2.5 rounded-full text-sm hover:border-primary transition-colors">
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <button onClick={() => navigate("cart")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </button>

      <h1 className="text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>Checkout</h1>

      {/* Step tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
        {(["address", "payment"] as CheckoutStep[]).map((s, i) => (
          <button key={s} onClick={() => step !== "processing" && setStep(s)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${step === s ? "bg-card shadow text-foreground font-semibold" : "text-muted-foreground"}`}>
            {i + 1}. {s === "address" ? "Delivery Address" : "Payment"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* ── ADDRESS ── */}
          {step === "address" && (
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Delivery Address</h3>
              {user?.addresses?.length ? (
                <div className="space-y-3 mb-4">
                  {user.addresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAddr === addr.id ? "border-primary bg-secondary" : "border-border hover:border-primary/40"}`}>
                      <input type="radio" name="addr" value={addr.id} checked={selectedAddr === addr.id} onChange={() => setSelectedAddr(addr.id)} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{addr.label}</p>
                        <p className="text-xs text-muted-foreground">{addr.line1}, {addr.city} - {addr.pincode}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="bg-secondary rounded-xl p-4 mb-4 text-sm text-muted-foreground">
                  No saved addresses. <button onClick={() => navigate("profile", "addresses")} className="text-primary hover:underline">Add address in Profile →</button>
                </div>
              )}
              <button onClick={() => setStep("payment")} disabled={!user?.addresses?.length}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                Continue to Payment
              </button>
            </div>
          )}

          {/* ── PAYMENT ── */}
          {step === "payment" && (
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-[#072654] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
                <h3 className="text-foreground font-semibold">Razorpay Checkout</h3>
                <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"><Lock className="w-3 h-3" /> Secure</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">256-bit SSL encrypted · PCI DSS compliant</p>

              {/* Method tabs */}
              <div className="flex gap-1 bg-muted rounded-xl p-1 mb-4">
                {([["upi", "UPI", Smartphone], ["card", "Card", CreditCard], ["netbanking", "Net Banking", Building2]] as const).map(([m, label, Icon]) => (
                  <button key={m} onClick={() => setPayMethod(m as PayMethod)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all ${payMethod === m ? "bg-card shadow text-foreground font-semibold" : "text-muted-foreground"}`}>
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>

              {payMethod === "upi" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">UPI ID</label>
                    <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi"
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                      <button key={app} className="px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {payMethod === "card" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Card Number</label>
                    <input value={cardNo} onChange={(e) => setCardNo(e.target.value)} placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1.5">Expiry</label>
                      <input value={cardExp} onChange={(e) => setCardExp(e.target.value)} placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1.5">CVV</label>
                      <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="•••" type="password"
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Cardholder Name</label>
                    <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="As on card"
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
                  </div>
                </div>
              )}

              {payMethod === "netbanking" && (
                <div className="grid grid-cols-3 gap-2">
                  {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map((bank) => (
                    <button key={bank} className="p-3 rounded-xl border border-border text-xs text-foreground hover:border-primary hover:bg-secondary transition-colors font-medium">
                      {bank}
                    </button>
                  ))}
                </div>
              )}

              <button onClick={handlePayment}
                className="w-full mt-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Pay ₹{total}
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                By paying you agree to our <span className="text-primary cursor-pointer hover:underline">Terms & Conditions</span>
              </p>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm sticky top-20">
            <h3 className="text-foreground font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate flex-1 pr-2">{item.name} × {item.quantity}</span>
                  <span className="text-foreground font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Delivery</span>{delivery === 0 ? <span className="text-green-600 font-medium">FREE</span> : <span>₹{delivery}</span>}</div>
              <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border">
                <span>Total</span>
                <span className="text-primary" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem" }}>₹{total}</span>
              </div>
            </div>
            {defaultAddr && (
              <div className="mt-4 bg-secondary rounded-xl px-3 py-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">Delivering to</p>
                <p className="text-xs font-medium text-foreground">{addrStr}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

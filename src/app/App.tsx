import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { initStore } from "./services/store";
import { startSocketSimulator } from "./services/socket";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { AdminApp } from "./pages/AdminApp";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Navbar } from "./components/Navbar";

// Initialize mock store and socket simulator once at app boot
initStore();
startSocketSimulator();

function Router() {
  const { user, authLoading, page, subPage } = useApp();
  const [showLanding, setShowLanding] = useState(true);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading Pizzeria...</p>
        </div>
      </div>
    );
  }

  // Not logged in → Show landing page first, then auth page
  if (!user) {
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }
    return <AuthPage />;
  }

  // Admin → Admin dashboard (no Navbar)
  if (user.role === "admin") return <AdminApp />;

  // User → User app with Navbar
  const renderPage = () => {
    switch (page) {
      case "home":     return <HomePage />;
      case "cart":     return <CartPage />;
      case "checkout": return <CheckoutPage />;
      case "orders":   return <OrdersPage />;
      case "profile":  return <ProfilePage initialTab={(subPage as "profile" | "password" | "addresses") || "profile"} />;
      default:         return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

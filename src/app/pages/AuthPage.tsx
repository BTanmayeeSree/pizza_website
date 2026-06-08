import React, { useState } from "react";
import { Pizza, Eye, EyeOff, Shield, User, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { authAPI } from "../services/store";

type AuthView = "login" | "register" | "forgot" | "reset" | "verify" | "reset-sent";
type Role = "user" | "admin";

function Spinner() {
  return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />;
}

export function AuthPage() {
  const { login } = useApp();
  const [view, setView] = useState<AuthView>("login");
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [pendingUserId, setPendingUserId] = useState("");

  const DEMO = { user: "user@pizzeria.in / user123", admin: "admin@pizzeria.in / admin123" };

  const clear = () => { setError(""); setSuccess(""); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); clear(); setLoading(true);
    try { await login(email, password); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); clear();
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (phone.length < 10) { setError("Enter a valid 10-digit phone number."); return; }
    setLoading(true);
    try {
      const { user } = await authAPI.register(name, email, password, phone);
      setPendingUserId(user.id);
      setView("verify");
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); clear(); setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      setResetToken(res.token);
      setView("reset-sent");
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); clear();
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(resetToken, password);
      setSuccess("Password reset! You can now login.");
      setTimeout(() => setView("login"), 2000);
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await authAPI.verifyEmail(pendingUserId);
      await login(email, password);
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  };

  const fillDemo = () => {
    setEmail(role === "admin" ? "admin@pizzeria.in" : "user@pizzeria.in");
    setPassword(role === "admin" ? "admin123" : "user123");
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between p-12">
        <img
          src="https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=900&h=1200&fit=crop&auto=format"
          alt="Pizza"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-red-600/90 to-pink-600/90" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <Pizza className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>Pizzeria</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-white leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 900, lineHeight: 1.1 }}>
              Handcrafted<br />with love,<br /><span className="text-yellow-300">delivered fast.</span>
            </h2>
            <p className="text-white/80 text-base leading-relaxed max-w-md">
              Wood-fired pizzas, premium ingredients, and 30-minute delivery across India's top cities.
            </p>
          </div>
          <div className="flex gap-10">
            {[["10,000+", "Customers"], ["30 min", "Delivery"], ["4.9★", "Rating"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-white font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>{val}</p>
                <p className="text-white/70 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-white min-h-screen overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Pizza className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900 font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>Pizzeria</span>
          </div>

          {/* ── LOGIN ── */}
          {view === "login" && (
            <>
              <div className="flex bg-slate-100 rounded-2xl p-1.5 mb-8 shadow-inner">
                {(["user", "admin"] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); clear(); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all capitalize ${role === r ? "bg-white shadow-lg text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {r === "admin" ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    {r === "admin" ? "Admin" : "Customer"}
                  </button>
                ))}
              </div>
              <h1 className="text-slate-900 mb-2 font-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>Welcome back</h1>
              <p className="text-slate-600 text-base mb-8">
                {role === "admin" ? "Sign in to manage your restaurant" : "Sign in to order your favourite pizza"}
              </p>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-2 uppercase tracking-wider">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder={role === "admin" ? "admin@pizzeria.in" : "user@pizzeria.in"}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-orange-400 text-sm text-slate-900 transition-all shadow-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-2 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 pr-11 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-orange-400 text-sm text-slate-900 transition-all shadow-sm" />
                    <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>}
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setView("forgot"); clear(); }} className="text-sm text-orange-600 font-semibold hover:text-orange-700 hover:underline">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all text-base flex items-center justify-center gap-2">
                  {loading ? <><Spinner /> Signing in...</> : "Sign In"}
                </button>
              </form>
              <div className="mt-5 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl text-sm text-center">
                <span className="font-semibold text-slate-900">Demo Account:</span>{" "}
                <button onClick={fillDemo} className="text-orange-600 font-bold hover:underline">{DEMO[role]}</button>
              </div>
              <p className="text-center text-base text-slate-600 mt-6">
                New here?{" "}
                <button onClick={() => { setView("register"); clear(); }} className="text-orange-600 font-bold hover:underline">Create Account</button>
              </p>
            </>
          )}

          {/* ── REGISTER ── */}
          {view === "register" && (
            <>
              <button onClick={() => { setView("login"); clear(); }} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8 transition-colors font-semibold">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>
              <h1 className="text-slate-900 mb-2 font-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>Create Account</h1>
              <p className="text-slate-600 text-base mb-8">Join thousands of pizza lovers across India</p>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-2 uppercase tracking-wider">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Rahul Sharma"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-orange-400 text-sm text-slate-900 transition-all shadow-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-2 uppercase tracking-wider">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="rahul@example.in"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-orange-400 text-sm text-slate-900 transition-all shadow-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-2 uppercase tracking-wider">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="9876543210"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-orange-400 text-sm text-slate-900 transition-all shadow-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-2 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters"
                      className="w-full px-4 py-3.5 pr-11 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-orange-400 text-sm text-slate-900 transition-all shadow-sm" />
                    <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-2 uppercase tracking-wider">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-orange-400 text-sm text-slate-900 transition-all shadow-sm" />
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all text-base flex items-center justify-center gap-2 mt-6">
                  {loading ? <><Spinner /> Creating...</> : "Create Account"}
                </button>
              </form>
              <p className="text-center text-base text-slate-600 mt-6">
                Already have an account?{" "}
                <button onClick={() => { setView("login"); clear(); }} className="text-orange-600 font-bold hover:underline">Sign In</button>
              </p>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {view === "forgot" && (
            <>
              <button onClick={() => { setView("login"); clear(); }} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8 transition-colors font-semibold">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h1 className="text-slate-900 mb-2 font-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>Forgot Password?</h1>
              <p className="text-slate-600 text-base mb-8 leading-relaxed">Enter your email and we'll send a reset link to recover your account.</p>
              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-2 uppercase tracking-wider">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="rahul@example.in"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-orange-400 text-sm text-slate-900 transition-all shadow-sm" />
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all text-base flex items-center justify-center gap-2">
                  {loading ? <><Spinner /> Sending...</> : "Send Reset Link"}
                </button>
              </form>
            </>
          )}

          {/* ── RESET LINK SENT ── */}
          {view === "reset-sent" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Mail className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-slate-900 mb-3 font-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>Check your email</h2>
              <p className="text-slate-600 text-base mb-8 leading-relaxed">We've sent a reset link to <strong className="text-slate-900">{email}</strong></p>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 mb-6 text-left">
                <p className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Demo: Reset Password</p>
                <div className="space-y-3">
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password"
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-400 transition-all shadow-sm" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password"
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-400 transition-all shadow-sm" />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {success && <p className="text-sm text-green-600 font-semibold">{success}</p>}
                  <button onClick={(e) => handleReset(e as unknown as React.FormEvent)} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                    {loading ? <><Spinner /> Resetting...</> : "Reset Password"}
                  </button>
                </div>
              </div>
              <button onClick={() => { setView("login"); clear(); }} className="text-sm text-orange-600 font-semibold hover:underline">Back to login</button>
            </div>
          )}

          {/* ── EMAIL VERIFY ── */}
          {view === "verify" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-slate-900 mb-3 font-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>Verify Your Email</h2>
              <p className="text-slate-600 text-base mb-8 leading-relaxed">
                A verification link was sent to <strong className="text-slate-900">{email}</strong>.
                Click below to verify and start ordering delicious pizzas!
              </p>
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mb-4">{error}</p>}
              <button onClick={handleVerify} disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all text-base flex items-center justify-center gap-2">
                {loading ? <><Spinner /> Verifying...</> : "Verify & Continue"}
              </button>
              <p className="text-sm text-slate-600 mt-5">Didn't receive? <button className="text-orange-600 font-semibold hover:underline">Resend email</button></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

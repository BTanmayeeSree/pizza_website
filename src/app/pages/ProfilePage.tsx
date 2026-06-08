import React, { useState } from "react";
import { User, Lock, MapPin, Plus, Trash2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import { userAPI } from "../services/store";
import type { Address } from "../types";

type Tab = "profile" | "password" | "addresses";

function Spinner() { return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />; }

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${ok ? "bg-green-600 text-white" : "bg-destructive text-white"}`}>
      <CheckCircle2 className="w-4 h-4" /> {msg}
    </div>
  );
}

export function ProfilePage({ initialTab = "profile" }: { initialTab?: Tab }) {
  const { user, navigate } = useApp();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Profile fields
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email] = useState(user?.email ?? "");

  // Password fields
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses ?? []);
  const [addingAddr, setAddingAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "Home", line1: "", city: "", pincode: "" });

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userAPI.updateProfile(user!.id, { name, phone });
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast((err as Error).message, false);
    } finally { setLoading(false); }
  };

  const handleChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confPass) { showToast("Passwords do not match.", false); return; }
    if (newPass.length < 6) { showToast("Password must be at least 6 characters.", false); return; }
    setLoading(true);
    try {
      await userAPI.changePassword(user!.id, curPass, newPass);
      setCurPass(""); setNewPass(""); setConfPass("");
      showToast("Password changed successfully!");
    } catch (err) {
      showToast((err as Error).message, false);
    } finally { setLoading(false); }
  };

  const handleAddAddress = async () => {
    if (!newAddr.line1 || !newAddr.city || !newAddr.pincode) { showToast("Fill all address fields.", false); return; }
    const addr: Address = { id: "a" + Date.now(), ...newAddr, isDefault: addresses.length === 0 };
    const updated = [...addresses, addr];
    await userAPI.updateProfile(user!.id, { addresses: updated });
    setAddresses(updated);
    setNewAddr({ label: "Home", line1: "", city: "", pincode: "" });
    setAddingAddr(false);
    showToast("Address added!");
  };

  const handleDeleteAddr = async (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    await userAPI.updateProfile(user!.id, { addresses: updated });
    setAddresses(updated);
    showToast("Address removed.");
  };

  const handleSetDefault = async (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    await userAPI.updateProfile(user!.id, { addresses: updated });
    setAddresses(updated);
    showToast("Default address updated.");
  };

  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h1 className="text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>My Account</h1>

      {/* User summary */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-bold text-xl">{user?.name[0]}</span>
        </div>
        <div>
          <p className="font-semibold text-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            {user?.verified
              ? <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
              : <span className="text-xs text-amber-600">⚠ Email not verified</span>}
            <span className="text-xs text-muted-foreground">· Member since {new Date(user?.createdAt ?? "").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-xl p-1 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id as Tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm transition-all ${tab === id ? "bg-card shadow text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
            <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── PROFILE ── */}
      {tab === "profile" && (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="text-foreground font-semibold mb-4">Personal Information</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Email Address</label>
              <input value={email} disabled className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-muted-foreground cursor-not-allowed" />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Phone Number</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel"
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {loading ? <><Spinner /> Saving...</> : "Save Changes"}
            </button>
          </form>
        </div>
      )}

      {/* ── PASSWORD ── */}
      {tab === "password" && (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="text-foreground font-semibold mb-4">Change Password</h3>
          <form onSubmit={handleChangePass} className="space-y-4">
            {[
              { label: "Current Password", val: curPass, set: setCurPass },
              { label: "New Password", val: newPass, set: setNewPass },
              { label: "Confirm New Password", val: confPass, set: setConfPass },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <label className="text-xs text-muted-foreground block mb-1.5">{label}</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={val} onChange={(e) => set(e.target.value)} required placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
                  <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {loading ? <><Spinner /> Updating...</> : "Update Password"}
            </button>
          </form>
        </div>
      )}

      {/* ── ADDRESSES ── */}
      {tab === "addresses" && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-card rounded-2xl border-2 p-4 shadow-sm ${addr.isDefault ? "border-primary" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                      {addr.label}
                      {addr.isDefault && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Default</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{addr.line1}, {addr.city} - {addr.pincode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-primary hover:underline">Set default</button>
                  )}
                  <button onClick={() => handleDeleteAddr(addr.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {addingAddr ? (
            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm space-y-3">
              <h4 className="font-semibold text-foreground text-sm">New Address</h4>
              <div className="flex gap-2">
                {["Home", "Office", "Other"].map((l) => (
                  <button key={l} onClick={() => setNewAddr((a) => ({ ...a, label: l }))}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${newAddr.label === l ? "border-primary bg-secondary text-primary font-semibold" : "border-border text-muted-foreground"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <input value={newAddr.line1} onChange={(e) => setNewAddr((a) => ({ ...a, line1: e.target.value }))} placeholder="Street / Flat, Building"
                className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-3">
                <input value={newAddr.city} onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))} placeholder="City"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
                <input value={newAddr.pincode} onChange={(e) => setNewAddr((a) => ({ ...a, pincode: e.target.value }))} placeholder="Pincode"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddAddress} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Save Address</button>
                <button onClick={() => setAddingAddr(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-foreground hover:border-primary transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingAddr(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          )}
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  );
}

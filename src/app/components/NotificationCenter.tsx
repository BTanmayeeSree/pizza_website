import React, { useEffect } from "react";
import { X, Bell, ShoppingBag, CreditCard, AlertTriangle, Info, CheckCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { AppNotification } from "../types";

const ICONS: Record<AppNotification["type"], React.ElementType> = {
  order: ShoppingBag,
  payment: CreditCard,
  stock: AlertTriangle,
  system: Info,
};

const ICON_COLORS: Record<AppNotification["type"], string> = {
  order: "bg-blue-100 text-blue-600",
  payment: "bg-green-100 text-green-600",
  stock: "bg-red-100 text-red-600",
  system: "bg-purple-100 text-purple-600",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

interface Props { onClose: () => void; }

export function NotificationCenter({ onClose }: Props) {
  const { notifications, markNotifRead, markAllRead, refreshNotifs } = useApp();

  useEffect(() => { refreshNotifs(); }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} onClick={onClose}>
      <div className="bg-card h-full w-full max-w-sm flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Notifications</h2>
            {unread > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-semibold">{unread}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button onClick={() => markAllRead()} title="Mark all read" className="text-muted-foreground hover:text-primary transition-colors">
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bell className="w-10 h-10 text-muted-foreground mb-3 opacity-40" />
              <p className="text-muted-foreground text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => {
                const Icon = ICONS[notif.type];
                return (
                  <button
                    key={notif.id}
                    onClick={() => markNotifRead(notif.id)}
                    className={`w-full flex gap-3 p-4 text-left hover:bg-muted/40 transition-colors ${!notif.read ? "bg-primary/3" : ""}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ICON_COLORS[notif.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-tight ${!notif.read ? "font-semibold text-foreground" : "text-foreground"}`}>
                          {notif.title}
                        </p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(notif.createdAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                      {!notif.read && <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

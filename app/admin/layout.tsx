// app/admin/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react"; // Added this import
import {
  LogOut,
  Package,
  ShoppingBag,
  Users,
  LayoutDashboard,
  CreditCard,
  ArrowLeft,
  Menu,
  X,
  MessageSquare,
  MegaphoneIcon,
  MailOpen,
  Mail,
} from "lucide-react";
import ProfileMenu from "../admin/components/profile/ProfileMenu";
import AdminGuard from "../admin/components/auth/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const syncOrderNotifications = async () => {
      try {
        const response = await fetch("/api/admin/orders/notifications", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        const orderNotifications = Array.isArray(data.orders) ? data.orders : [];
        const latestNotificationAt = orderNotifications[0]?.notificationAt as
          | string
          | undefined;

        if (!latestNotificationAt) {
          if (!cancelled) setNewOrderCount(0);
          return;
        }

        const storageKey = "daima-admin-last-seen-order-notification-at";

        // Opening the Orders screen acknowledges all current order notifications.
        if (pathname.startsWith("/admin/orders")) {
          localStorage.setItem(storageKey, latestNotificationAt);
          if (!cancelled) setNewOrderCount(0);
          return;
        }

        const lastSeenAt = localStorage.getItem(storageKey);
        const lastSeenTimestamp = lastSeenAt ? Date.parse(lastSeenAt) : 0;

        const unseenOrderNotifications = orderNotifications.filter(
          (order: { notificationAt?: string }) =>
            order.notificationAt &&
            Date.parse(order.notificationAt) > lastSeenTimestamp,
        ).length;

        if (!cancelled) setNewOrderCount(unseenOrderNotifications);
      } catch (error) {
        console.error("Failed to refresh order notifications:", error);
      }
    };

    syncOrderNotifications();
    const intervalId = window.setInterval(syncOrderNotifications, 30_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [pathname]);

  // Function to handle logout and redirect
  const handleExitStore = async () => {
    setIsLoggingOut(true);
    await signOut({
      callbackUrl: "/", // Redirects to home page after logout
      redirect: true,
    });
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#e8e8e8] antialiased">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen w-72 bg-white z-[70] transition-transform duration-500 ease-in-out border-r border-neutral-200
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-8 lg:p-10 border-b border-neutral-100 flex flex-col items-center relative">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 lg:hidden text-neutral-400 hover:text-black"
            >
              <X size={20} />
            </button>
            <Link href="/admin" className="relative w-28 lg:w-32 h-14 lg:h-16">
              <Image
                src="/assets/Logo_no-bg.png"
                alt="Daima Mkenya"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 112px, 128px"
                priority
              />
            </Link>
            <span className="mt-4 text-[9px] text-[#be1e2d] uppercase tracking-[0.5em] font-black">
              Registry Admin
            </span>
          </div>

          <nav className="flex-1 px-4 py-8 lg:py-12 space-y-1 overflow-y-auto">
            <p className="text-[9px] text-neutral-400 uppercase tracking-[0.4em] mb-4 px-6 font-black">
              Management
            </p>
            <AdminNavLink
              href="/admin"
              icon={<LayoutDashboard size={16} />}
              label="Overview"
              onClick={() => setSidebarOpen(false)}
            />
            <AdminNavLink
              href="/admin/products"
              icon={<ShoppingBag size={16} />}
              label="Inventory"
              onClick={() => setSidebarOpen(false)}
            />
            <AdminNavLink
              href="/admin/orders"
              icon={<Package size={16} />}
              label="Orders"
              badgeCount={newOrderCount}
              onClick={() => setSidebarOpen(false)}
            />
            <AdminNavLink
              href="/admin/users"
              icon={<Users size={16} />}
              label="Customers"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Add Inquiries link here */}
            <AdminNavLink
              href="/admin/inquiries"
              icon={<MessageSquare size={16} />}
              label="Inquiries"
              onClick={() => setSidebarOpen(false)}
            />
            <AdminNavLink
              href="/admin/transactions"
              icon={<CreditCard size={16} />}
              label="Financials"
              onClick={() => setSidebarOpen(false)}
            />
            <AdminNavLink
              href="/admin/contact-submissions"
              icon={<MailOpen size={16} />}
              label="Contact Submissions"
              onClick={() => setSidebarOpen(false)}
            />
            <AdminNavLink
              href="/admin/announcement-batches"
              icon={<MegaphoneIcon size={16} />}
              label="New Releases"
              onClick={() => setSidebarOpen(false)}
            />
          </nav>

          <div className="p-8 border-t border-neutral-100 space-y-6">
            {/* Changed from Link to button for Logout functionality */}
            <button
              onClick={handleExitStore}
              disabled={isLoggingOut}
              className="group relative flex items-center justify-center gap-2 w-full overflow-hidden border border-black py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-black group-hover:text-white transition-colors duration-500">
                <ArrowLeft size={14} />{" "}
                {isLoggingOut ? "Exiting..." : "Exit to Store"}
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col w-full min-w-0">
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-neutral-200 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-[50]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center p-2 text-black"
              >
                <Menu size={24} />
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-neutral-50 px-3 py-1.5 border border-neutral-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                  Registry Live
                </span>
              </div>
            </div>
            <ProfileMenu />
          </header>

          <div className="p-4 sm:p-8 lg:p-12 max-w-[1600px] w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function AdminNavLink({ href, icon, label, onClick, badgeCount = 0 }: any) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-4 px-6 py-4 relative transition-all ${isActive ? "text-black" : "text-neutral-400 hover:text-black"}`}
    >
      <span className="z-10">{icon}</span>
      <span className="z-10 text-[11px] font-black uppercase tracking-[0.2em]">
        {label}
      </span>
      {badgeCount > 0 && (
        <span
          aria-label={`${badgeCount} new order ${badgeCount === 1 ? "notification" : "notifications"}`}
          className="z-10 ml-auto min-w-6 h-6 px-1.5 rounded-full bg-[#be1e2d] text-white text-[9px] font-black flex items-center justify-center tabular-nums"
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute left-0 w-full h-full bg-neutral-50 border-l-[3px] border-[#be1e2d] z-0"
        />
      )}
    </Link>
  );
}

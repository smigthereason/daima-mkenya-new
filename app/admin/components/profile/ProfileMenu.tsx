// components/admin/ProfileMenu.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = session?.user?.name?.[0] || "A";
  const isAdmin =
    session?.user?.isAdmin === true || session?.user?.role === "admin";

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 bg-neutral-50 border border-neutral-100 rounded-full hover:bg-neutral-100 transition-all"
      >
        <div className="relative h-9 w-9 rounded-full bg-neutral-900 flex items-center justify-center text-white font-black text-sm overflow-hidden">
          {session?.user?.image && !imageError ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              fill
              sizes="36px"
              className="object-cover"
              unoptimized // Bypasses optimization to prevent server timeouts for external images
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{userInitial}</span>
          )}
        </div>

        <span className="text-xs font-black uppercase tracking-wider text-neutral-900 hidden md:block">
          {session?.user?.name || "Admin"}
        </span>

        <ChevronDown
          size={16}
          className={`text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-0 mt-3 w-64 bg-white rounded-none shadow-2xl border border-neutral-100 py-2 z-50"
          >
            {/* User Info Section */}
            <div className="px-5 py-4 border-b border-neutral-100">
              <p className="text-xs font-black text-neutral-900 truncate uppercase tracking-wider">
                {session?.user?.name}
              </p>
              <p className="text-[10px] text-neutral-400 truncate tracking-wide">
                {session?.user?.email}
              </p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 mt-2 text-[8px] font-bold text-[#be1e2d] bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  <ShieldCheck size={10} /> Authenticated Admin
                </span>
              )}
            </div>

            {/* Menu Links */}
            <Link
              href="/admin/profile"
              className="flex items-center gap-3 px-5 py-3.5 text-[11px] font-bold text-neutral-900 hover:bg-neutral-50 transition-colors uppercase tracking-widest"
              onClick={() => setIsOpen(false)}
            >
              <User size={14} className="text-neutral-400" />
              Manage Profile
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-5 py-3.5 text-[11px] font-bold text-neutral-900 hover:bg-neutral-50 transition-colors uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                <ShieldCheck size={14} className="text-neutral-400" />
                Dashboard
              </Link>
            )}

            <hr className="my-2 border-neutral-100" />

            {/* Sign Out Button */}
            <button
              className="w-full flex items-center gap-3 px-5 py-3.5 text-[11px] font-bold text-[#be1e2d] hover:bg-red-50 transition-colors uppercase tracking-widest"
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/login" });
              }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

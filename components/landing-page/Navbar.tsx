"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Search, User, ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HeroImage2, Logo, SideStripe } from "@/public/assets";
import gsap from "gsap";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      // Ensure it's visible before animating
      gsap.set(menuRef.current, { display: "block" });
      
      const tl = gsap.timeline();
      tl.to(menuRef.current, {
        x: 0,
        duration: 0.8,
        ease: "expo.out",
      })
      .fromTo(
        ".menu-item",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.4"
      );
    } else {
      gsap.to(menuRef.current, {
        x: "-100%",
        duration: 0.6,
        ease: "expo.in",
        onComplete: () => {
          gsap.set(menuRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  const navLinks = [
    { name: "About Us", badge: null, path: "/about" },
    { name: "Products", badge: null, path: "/products" },
    { name: "Gallery", badge: null, path: "#" },
    { name: "Men", badge: null, path: "#" },
    { name: "Women", badge: null, path: "#" },
    { name: "Kids", badge: "coming soon", path: "#" },
  ];

  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent px-6 lg:px-12 py-8">
      <div className="grid grid-cols-3 items-center w-full max-w-[1800px] mx-auto">
        {/* LEFT: TOGGLE */}
        <div className="flex justify-start">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <span className="w-full h-[1.5px] bg-black transition-all group-hover:w-1/2"></span>
              <span className="w-full h-[1.5px] bg-black"></span>
              <span className="w-full h-[1.5px] bg-black transition-all group-hover:w-3/4"></span>
            </div>
            <span className="hidden md:block text-[11px] text-black uppercase tracking-[0.2em] font-medium pt-0.5">
              Menu
            </span>
          </button>
        </div>

        {/* CENTER: LOGO */}
        <div className="flex justify-center">
          <Link href="/" className="relative block">
            <div className="block md:hidden">
              <Image src={SideStripe} alt="DMA" height={60} width={60} priority />
            </div>
            <div className="hidden md:block">
              <Image src={Logo} alt="DMA" height={120} width={120} priority />
            </div>
          </Link>
        </div>

        {/* RIGHT: ICONS */}
        <div className="flex justify-end items-center gap-4 md:gap-6">
          <Search size={20} className="hidden sm:block cursor-pointer hover:scale-110 transition-transform stroke-[1.5px] text-neutral-700" />
          <Link href="/login">
            <User size={20} className="cursor-pointer hover:scale-110 transition-transform stroke-[1.5px] text-neutral-700" />
          </Link>
          <Link href="/cart" className="relative cursor-pointer hover:scale-110 transition-transform">
            <ShoppingBag size={20} className="stroke-[1.5px] text-neutral-700" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#be1e2d] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* FULL SCREEN OVERLAY */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-[#f8f8f8] z-[9999] overflow-hidden shadow-2xl"
        style={{ display: "none", transform: "translateX(-100%)" }}
      >
        <div className="p-8 md:p-16 flex flex-col h-full max-w-7xl mx-auto text-black">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <span className="text-sm tracking-[0.4em] font-light">DMA STUDIO</span>
            <button
              onClick={() => setIsOpen(false)}
              className="group p-4 flex items-center gap-2 hover:opacity-60 transition-opacity cursor-pointer"
            >
              <span className="text-[10px] uppercase tracking-widest">Close</span>
              <X size={24} className="stroke-[1px]" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="menu-item group flex items-center justify-between text-4xl md:text-7xl font-light text-black border-b border-transparent py-2 transition-all"
                >
                  <span className="relative">
                    {link.name}
                    {link.badge && (
                      <span className="absolute top-14 -right-22 text-[12px] text-[#be1e2d] font-bold tracking-tighter uppercase">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight
                    className="opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all stroke-[1px]"
                    size={40}
                  />
                </Link>
              ))}
            </div>

            {/* FEATURED IMAGE */}
            <div className="hidden md:flex flex-col justify-center border-l border-gray-100 pl-20">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Featured Collection</p>
              <div className="aspect-[3/4] w-72 relative overflow-hidden shadow-2xl bg-gray-200">
                {isMounted && (
                  <Image src={HeroImage2} alt="Featured" fill className="object-cover" />
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-8 text-[10px] tracking-[0.2em] uppercase">
            <div className="flex gap-8 font-bold">
              <span className="hover:text-[#be1e2d] cursor-pointer transition-colors">Instagram</span>
              <span className="hover:text-[#be1e2d] cursor-pointer transition-colors">Facebook</span>
            </div>
            <span className="text-gray-400">© {new Date().getFullYear()} DMA Studio Africa</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
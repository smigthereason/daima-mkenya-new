// components/landing-page/Navbar.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react'
import { Menu, X, Heart, User, ShoppingBag, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image';
import { HeroImage2 } from '@/public/assets';
import gsap from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.7,
        ease: "power3.out"
      });
      
      // Animate menu items
      gsap.from(".menu-item", {
        x: -30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out"
      });
    } else {
      gsap.to(menuRef.current, {
        x: "-100%",
        duration: 0.7,
        ease: "power3.in"
      });
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Men', badge: null },
    { name: 'Women', badge: null },
    { name: 'Kids', badge: 'SALE' },
    { name: 'All Products', badge: null },
    { name: 'About Us', badge: null },
  ]

  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent px-6 lg:px-12 py-5">
      {/* Grid Container for Perfect Centering */}
      <div className="grid grid-cols-3 items-center w-full">
        {/* 1. Left Section: Menu Toggle */}
        <div className="flex justify-start">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <span className="w-full h-[1.5px] bg-black transition-all group-hover:w-1/2"></span>
              <span className="w-full h-[1.5px] bg-black"></span>
              <span className="w-full h-[1.5px] bg-black transition-all group-hover:w-3/4"></span>
            </div>
            <span className="hidden md:block text-[11px] text-black uppercase tracking-[0.2em] font-medium pt-0.5">Menu</span>
          </button>
        </div>

        {/* 2. Center Section: Logo */}
        <div className="flex justify-center text-black">
          <Link href="/" className="text-2xl font-bold tracking-[0.3em] pl-[0.3em]">
            DMA
          </Link>
        </div>

        {/* 3. Right Section: Icons */}
        <div className="flex justify-end items-center gap-6">
          <Heart size={20} className="hidden sm:block cursor-pointer hover:scale-110 transition-transform stroke-[1.5px]" color='#a1a1a1' />
          <User size={20} className="hidden sm:block cursor-pointer hover:scale-110 transition-transform stroke-[1.5px]" color='#a1a1a1' />
          <div className="relative cursor-pointer hover:scale-110 transition-transform">
            <ShoppingBag size={20} className="stroke-[1.5px]" color='#a1a1a1' />
            <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </div>
        </div>
      </div>

      {/* Full-Screen Luxury Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-[#e8e8e8] z-[100] -translate-x-full"
      >
        <div className="p-8 md:p-16 flex flex-col h-full max-w-7xl mx-auto text-black">
          <div className="flex justify-between items-center">
            <span className="text-sm tracking-[0.4em] font-light">DMA STUDIO</span>
            <button
              onClick={() => setIsOpen(false)}
              className="group p-4 flex items-center gap-2 hover:opacity-60 transition-opacity"
            >
              <span className="text-[10px] uppercase tracking-widest">Close</span>
              <X size={24} className="stroke-[1px]" />
            </button>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className={`menu-item group flex items-center justify-between text-4xl md:text-7xl font-light text-black`}
                >
                  <span className="relative overflow-hidden">
                    {link.name}
                    {link.badge && (
                      <span className="absolute top-0 -right-8 text-[10px] text-red-500 font-bold tracking-tighter uppercase">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all stroke-[1px]" size={40} />
                </Link>
              ))}
            </div>

            {/* Aesthetic Menu Side-Content */}
            <div className="hidden md:flex flex-col justify-center border-l border-gray-100 pl-20">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Featured</p>
              <div className="aspect-square bg-gray-50 w-64 relative overflow-hidden rounded-sm">
                <Image
                  src={HeroImage2}
                  alt='Featured Image'
                  fill
                  objectFit='cover'
                />
              </div>
            </div>
          </div>

          <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-8 text-black text-[10px] tracking-[0.2em] uppercase">
            <div className="flex gap-8">
              <span className="hover:underline cursor-pointer">Instagram</span>
              <span className="hover:underline cursor-pointer">Facebook</span>
            </div>
            <span className="text-gray-400">© {new Date().getFullYear()} DMA Studio</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// components/landing-page/Footer.tsx
"use client";

import React from "react";
import { Instagram, Facebook, ArrowRight } from "lucide-react";
import Image from "next/image";
import { HeroImage2 } from "@/public/assets";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer
      className="footer-section text-white p-6 md:p-12 min-h-screen flex bg-neutral-900"
      id="footer-section"
    >
      <div className="footer-content  w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch   overflow-hidden p-4 md:p-8">
        {/* Left Section: Information */}
        <div className="flex flex-col justify-between py-8 px-4">
          <div>
            <nav className="flex space-x-6 text-sm font-medium mb-16 text-zinc-300">
              <a
                href="#"
                className="inline-block transition-all duration-500 ease-out hover:text-white hover:scale-110 active:scale-95"
              >
                Products
              </a>
              <a
                href="#"
                className="inline-block transition-all duration-500 ease-out hover:text-white hover:scale-110 active:scale-95"
              >
                Men
              </a>
              <a
                href="#"
                className="inline-block transition-all duration-500 ease-out hover:text-white hover:scale-110 active:scale-95"
              >
                Women
              </a>
              <a
                href="#"
                className="inline-block transition-all duration-500 ease-out hover:text-white hover:scale-110 active:scale-95"
              >
                Kids
              </a>
            </nav>

            <h2 className="text-3xl uppercase md:text-6xl font-semibold tracking-tight leading-tight mb-16">
              UNITY IN EVERY THREAD
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
              <div className="contact-info">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">
                  Phone
                </p>
                <p className="text-sm">+254 721 888 887</p>
              </div>
              <div className="contact-info">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">
                  E-mail
                </p>
                <p className="text-sm text-zinc-300">
                  info@daimamkenyaafrica.com
                </p>
              </div>
              <div className="contact-info">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">
                  Address
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  P.O Box 63023, 00200 <br /> Nairobi, Kenya
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end gap-8">
              <div className="max-w-xs">
                <p className="text-lg font-medium leading-snug">
                  Sign up for the latest updates and exclusive offers
                </p>
              </div>
              <div className="flex-1 max-w-sm">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-transparent border-b border-zinc-700 pb-2 mb-4 focus:outline-none focus:border-white transition-colors duration-300"
                />
                <button className="group relative overflow-hidden border-2 border-white bg-white px-8 py-3 text-[11px] font-black tracking-[0.4em] uppercase text-black transition-colors duration-300">
                  <span className="absolute inset-0 z-0 translate-y-full bg-neutral-900 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                  <span className="relative z-10 group-hover:text-white">
                    Subscribe
                  </span>
                </button>
              </div>
            </div>

            <div className="flex space-x-4 social-icons">
              {[Instagram, FaXTwitter, Facebook].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 bg-white text-black transition-all duration-300 
                 hover:bg-zinc-900 hover:text-white hover:scale-110 
                 border border-transparent hover:border-zinc-400"
                >
                  <Icon size={20} fill={idx === 1 ? "currentColor" : "none"} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Visual / Product Card */}
        <div className="relative group overflow-hidden hidden md:flex product-visual">
          <Image
            src={HeroImage2}
            alt="Person wearing Sonos Ace"
            className="w-full h-full object-cover min-h-125 transition-transform duration-700 group-hover:scale-105"
            draggable={false}
          />
          <div className="absolute top-8 left-8 text-white">
            <h3 className="text-2xl font-medium">Daima Mkenya Africa</h3>
            <p className="text-zinc-300 text-sm">Premium Clothing Line</p>
          </div>

          <div className="absolute bottom-8 right-8">
            <button className="bg-white text-black p-6  flex flex-col items-start gap-4 hover:bg-zinc-100 transition-all duration-300 w-48 shadow-2xl hover:shadow-xl hover:scale-105">
              <div className="w-full flex justify-end">
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </div>
              <span className="text-left font-semibold leading-tight">
                See the Product
                <br />
                Specification
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

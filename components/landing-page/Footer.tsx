// components/landing-page/Footer.tsx
"use client";

import React, { useState } from "react";
import { Instagram, Facebook, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { HeroImage2 } from "@/public/assets";
import {
  FaXTwitter,
  FaTiktok,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import Link from "next/link";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");

        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="bg-neutral-900 text-white w-full" id="footer-section">
      {/* Main container - responsive padding */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        {/* Responsive layout: stacks on mobile/tablet, side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
          {/* LEFT COLUMN - Takes full width on mobile/tablet */}
          <div className="w-full lg:w-1/2 space-y-8 md:space-y-10 lg:space-y-12">
            {/* Navigation Links */}
            <nav className="flex flex-wrap gap-5 md:gap-6 text-sm font-medium text-zinc-300">
              <Link
                href="/products"
                className="transition-all duration-300 hover:text-white hover:scale-105 inline-block"
              >
                Products
              </Link>
              <Link
                href="/gallery"
                className="transition-all duration-300 hover:text-white hover:scale-105 inline-block"
              >
                Gallery
              </Link>
              <Link
                href="/about"
                className="transition-all duration-300 hover:text-white hover:scale-105 inline-block"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="transition-all duration-300 hover:text-white hover:scale-105 inline-block"
              >
                Contact Us
              </Link>
            </nav>

            {/* Main Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl uppercase font-semibold tracking-tight leading-tight">
              UNITY IN <br className="block sm:hidden" />
              EVERY THREAD
            </h2>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 md:mb-2">
                  Phone
                </p>
                <p className="text-sm md:text-base">+254 721 888 887</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 md:mb-2">
                  E-mail
                </p>
                <p className="text-xs md:text-sm text-zinc-300 wrap-break-word">
                  info@daimamkenyaafrica.com
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 md:mb-2">
                  Address
                </p>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  P.O Box 63023, 00200 <br /> Nairobi, Kenya
                </p>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-base md:text-lg font-medium leading-snug mb-3 md:mb-4">
                    Sign up for the latest updates and exclusive offers
                  </p>
                  <div className="relative max-w-md">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full bg-transparent border-b border-zinc-700 pb-2 text-sm md:text-base focus:outline-none focus:border-white transition-colors duration-300 pr-8"
                      disabled={status === "loading"}
                    />
                    {status === "success" && (
                      <CheckCircle
                        size={16}
                        className="absolute right-0 bottom-2 text-green-500"
                      />
                    )}
                    {status === "error" && (
                      <XCircle
                        size={16}
                        className="absolute right-0 bottom-2 text-red-500"
                      />
                    )}
                  </div>
                  {message && (
                    <p
                      className={`text-xs mt-2 ${
                        status === "success" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative overflow-hidden border-2 border-white bg-white px-6 md:px-8 py-2 md:py-3 text-[10px] md:text-[11px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 z-0 translate-y-full bg-neutral-900 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                  <span className="relative z-10 group-hover:text-white">
                    {status === "loading" ? "SUBSCRIBING..." : "SUBSCRIBE"}
                  </span>
                </button>
              </form>

              {/* Social Icons */}
              <div className="flex flex-wrap gap-2 md:gap-3 pt-4">
                <a
                  href="https://www.instagram.com/daima_mkenya.africa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 md:p-2 bg-white text-black rounded-sm transition-all duration-300 hover:bg-zinc-900 hover:text-white hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={16} className="md:w-5 md:h-5" />
                </a>
                <a
                  href="https://x.com/Daimaafricake_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 md:p-2 bg-white text-black rounded-sm transition-all duration-300 hover:bg-zinc-900 hover:text-white hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaXTwitter size={16} className="md:w-5 md:h-5" />
                </a>
                <a
                  href="https://www.facebook.com/DaimaMkenyaAfri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 md:p-2 bg-white text-black rounded-sm transition-all duration-300 hover:bg-zinc-900 hover:text-white hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={16} className="md:w-5 md:h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@daimamkenyaafrica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 md:p-2 bg-white text-black rounded-sm transition-all duration-300 hover:bg-zinc-900 hover:text-white hover:scale-110"
                  aria-label="TikTok"
                >
                  <FaTiktok size={16} className="md:w-5 md:h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/daimamkenya-africa-168134339"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 md:p-2 bg-white text-black rounded-sm transition-all duration-300 hover:bg-zinc-900 hover:text-white hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn size={16} className="md:w-5 md:h-5" />
                </a>
                <a
                  href="https://wa.me/254721888887"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 md:p-2 bg-white text-black rounded-sm transition-all duration-300 hover:bg-zinc-900 hover:text-white hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={16} className="md:w-5 md:h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Image (visible on ALL screen sizes) */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative w-full h-75 sm:h-87.5 md:h-100 lg:h-175 overflow-hidden group rounded-sm">
              <Image
                src={HeroImage2}
                alt="Person wearing Daima Mkenya - Premium African clothing"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                priority={false}
                quality={90}
              />
              {/* Text Overlay on Image */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 text-white z-10">
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-tight">
                  Daima Mkenya <br /> Africa
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm mt-1">
                  Premium Clothing Line
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

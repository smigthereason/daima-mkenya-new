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

        // Reset success message after 5 seconds
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
    <footer
      className="footer-section text-white p-4 md:p-8 lg:p-12 min-h-[80vh] md:min-h-[70vh] lg:min-h-screen flex bg-neutral-900"
      id="footer-section"
    >
      <div className="footer-content w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-stretch overflow-hidden p-4 md:p-6 lg:p-8">
        {/* Left Section: Information */}
        <div className="flex flex-col justify-between py-4 md:py-6 lg:py-8 px-2 md:px-4">
          <div>
            <nav className="flex flex-wrap gap-4 md:gap-6 text-sm font-medium mb-8 md:mb-12 lg:mb-16 text-zinc-300">
              <Link
                href="/products"
                className="inline-block transition-all duration-500 ease-out hover:text-white hover:scale-110 active:scale-95"
              >
                Products
              </Link>
              <Link
                href="/gallery"
                className="inline-block transition-all duration-500 ease-out hover:text-white hover:scale-110 active:scale-95"
              >
                Gallery
              </Link>
              <Link
                href="/about"
                className="inline-block transition-all duration-500 ease-out hover:text-white hover:scale-110 active:scale-95"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="inline-block transition-all duration-500 ease-out hover:text-white hover:scale-110 active:scale-95"
              >
                Contact Us
              </Link>
            </nav>

            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase font-semibold tracking-tight leading-tight mb-8 md:mb-12 lg:mb-16">
              UNITY IN <br className="block md:hidden" />
              EVERY THREAD
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
              <div className="contact-info">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 md:mb-2">
                  Phone
                </p>
                <p className="text-sm md:text-base">+254 721 888 887</p>
              </div>
              <div className="contact-info">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 md:mb-2">
                  E-mail
                </p>
                <p className="text-xs md:text-sm text-zinc-300 break-words">
                  info@daimamkenyaafrica.com
                </p>
              </div>
              <div className="contact-info sm:col-span-2 md:col-span-1">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 md:mb-2">
                  Address
                </p>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  P.O Box 63023, 00200 <br /> Nairobi, Kenya
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 lg:space-y-12">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 lg:gap-8"
            >
              <div className="max-w-xs">
                <p className="text-base md:text-lg font-medium leading-snug">
                  Sign up for the latest updates and exclusive offers
                </p>
              </div>
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-transparent border-b border-zinc-700 pb-2 mb-3 md:mb-4 text-sm md:text-base focus:outline-none focus:border-white transition-colors duration-300 pr-8"
                    disabled={status === "loading"}
                  />

                  {/* Status indicator */}
                  {status === "success" && (
                    <CheckCircle
                      size={16}
                      className="absolute right-0 top-1 text-green-500"
                    />
                  )}
                  {status === "error" && (
                    <XCircle
                      size={16}
                      className="absolute right-0 top-1 text-red-500"
                    />
                  )}
                </div>

                {/* Status message */}
                {message && (
                  <p
                    className={`text-xs mb-2 ${
                      status === "success" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative overflow-hidden border-2 border-white bg-white px-6 md:px-8 py-2 md:py-3 text-[10px] md:text-[11px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase text-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 z-0 translate-y-full bg-neutral-900 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                  <span className="relative z-10 group-hover:text-white">
                    {status === "loading" ? "SUBSCRIBING..." : "SUBSCRIBE"}
                  </span>
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2 md:gap-3 social-icons">
              <a
                href="https://www.instagram.com/daima_mkenya.africa/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 md:p-2 bg-white text-black transition-all duration-300
                           hover:bg-zinc-900 hover:text-white hover:scale-110
                           border border-transparent hover:border-zinc-400"
                aria-label="Instagram"
              >
                <Instagram size={16} className="md:w-5 md:h-5" />
              </a>
              <a
                href="https://x.com/Daimaafricake_"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 md:p-2 bg-white text-black transition-all duration-300
                           hover:bg-zinc-900 hover:text-white hover:scale-110
                           border border-transparent hover:border-zinc-400"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={16} className="md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.facebook.com/DaimaMkenyaAfri"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 md:p-2 bg-white text-black transition-all duration-300
                           hover:bg-zinc-900 hover:text-white hover:scale-110
                           border border-transparent hover:border-zinc-400"
                aria-label="Facebook"
              >
                <Facebook size={16} className="md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@daimamkenyaafrica?_r=1&_t=ZS-94iYS51JWuP"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 md:p-2 bg-white text-black transition-all duration-300
                           hover:bg-zinc-900 hover:text-white hover:scale-110
                           border border-transparent hover:border-zinc-400"
                aria-label="TikTok"
              >
                <FaTiktok size={16} className="md:w-5 md:h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/daimamkenya-africa-168134339?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 md:p-2 bg-white text-black transition-all duration-300
                           hover:bg-zinc-900 hover:text-white hover:scale-110
                           border border-transparent hover:border-zinc-400"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={16} className="md:w-5 md:h-5" />
              </a>
              <a
                href="https://wa.me/254721888887"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 md:p-2 bg-white text-black transition-all duration-300
                           hover:bg-zinc-900 hover:text-white hover:scale-110
                           border border-transparent hover:border-zinc-400"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={16} className="md:w-5 md:h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Section: Visual / Product Card */}
        <div className="relative group overflow-hidden flex md:hidden lg:flex product-visual min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-full">
          <Image
            src={HeroImage2}
            alt="Person wearing Daima Mkenya"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            draggable={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
          />

          {/* Text overlay - responsive positioning */}
          <div className="absolute top-3 sm:top-4 md:top-6 lg:top-8 left-3 sm:left-4 md:left-6 lg:left-8 text-white max-w-[60%] sm:max-w-[70%]">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium leading-tight">
              Daima Mkenya <br className="hidden sm:block" />
              Africa
            </h3>
            <p className="text-zinc-300 text-[10px] sm:text-xs md:text-sm mt-1">
              Premium Clothing Line
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

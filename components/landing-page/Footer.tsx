// components/landing-page/Footer.tsx
"use client";

import React from "react";
import { Instagram, Facebook, ArrowRight } from "lucide-react";
import Image from "next/image";
import { HeroImage2 } from "@/public/assets";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

const Footer = () => {
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
                href="#"
                className="inline-block transition-all duration-500 ease-out hover:text-white hover:scale-110 active:scale-95"
              >
                Kids
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
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 lg:gap-8">
              <div className="max-w-xs">
                <p className="text-base md:text-lg font-medium leading-snug">
                  Sign up for the latest updates and exclusive offers
                </p>
              </div>
              <div className="flex-1 max-w-sm">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-transparent border-b border-zinc-700 pb-2 mb-3 md:mb-4 text-sm md:text-base focus:outline-none focus:border-white transition-colors duration-300"
                />
                <button className="group relative overflow-hidden border-2 border-white bg-white px-6 md:px-8 py-2 md:py-3 text-[10px] md:text-[11px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase text-black transition-colors duration-300">
                  <span className="absolute inset-0 z-0 translate-y-full bg-neutral-900 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                  <span className="relative z-10 group-hover:text-white">
                    Subscribe
                  </span>
                </button>
              </div>
            </div>

            <div className="flex space-x-3 md:space-x-4 social-icons">
              {[Instagram, FaXTwitter, Facebook].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-1.5 md:p-2 bg-white text-black transition-all duration-300 
                 hover:bg-zinc-900 hover:text-white hover:scale-110 
                 border border-transparent hover:border-zinc-400"
                >
                  <Icon
                    size={16}
                    className="md:w-5 md:h-5"
                    fill={idx === 1 ? "currentColor" : "none"}
                  />
                </a>
              ))}
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

          {/* Responsive Button */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 right-3 sm:right-4 md:right-6 lg:right-8">
            <button
              className="group/btn bg-white text-black hover:bg-zinc-100 transition-all duration-300 shadow-2xl hover:shadow-xl hover:scale-105
    p-3 sm:p-4 md:p-5 lg:p-6
    w-28 sm:w-32 md:w-36 lg:w-40 xl:w-48
  "
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-left font-semibold leading-tight text-[10px] sm:text-xs md:text-sm">
                  See the <br className="block sm:hidden" />
                  Product <br className="hidden sm:block" />
                  Specification
                </span>
                <ArrowRight
                  size={14}
                  className="sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 sm:group-hover/btn:translate-x-2 transition-transform duration-300 flex-shrink-0 ml-1 sm:ml-2"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import React, { useState, useRef } from "react";
import { Mail, Lock, User } from "lucide-react";
import { FaFacebook, FaApple } from "react-icons/fa6";
import Image from "next/image";
import { Logo, HeroImage2 } from "@/public/assets";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-start md:items-center justify-center p-0 md:p-8 font-sans">
      {/* Main Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-250 mt-20 md:mt-0 min-h-screen md:min-h-0 md:h-162.5 bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-100"
      >
        {/* Animated Overlay Panel */}
        <div
          className={`
            relative md:absolute inset-y-0 w-full md:w-1/2 z-30 flex flex-col justify-center items-center text-white px-8 py-12 md:px-12 text-center transition-all duration-700 ease-in-out
            ${isSignUp ? "md:left-0" : "md:left-1/2"}
          `}
          style={{
            background: `linear-gradient(135deg, #000000 0%, #be1e2d 50%, #006241 100%)`,
          }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tighter mb-4 uppercase italic">
              {isSignUp ? "Welcome Back" : "Join the Legacy"}
            </h2>
            <p className="text-white/80 text-xs md:text-sm tracking-widest mb-8 leading-relaxed uppercase max-w-75">
              {isSignUp
                ? "To stay connected with the heritage, please login with your personal info."
                : "Enter your personal details and start your journey with Daima Mkenya Africa."}
            </p>
            <button
              onClick={toggleForm}
              className="px-10 py-3 border border-white/40 hover:bg-white hover:text-black transition-all duration-500 uppercase text-[10px] font-bold tracking-[0.3em]"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Image
              src={HeroImage2}
              alt="Pattern"
              fill
              className="object-cover grayscale"
            />
          </div>
        </div>

        {/* Form Sections Container */}
        <div className="grow md:flex-none md:w-full h-full relative bg-white">
          {/* Sign In Form */}
          <div
            className={`
            w-full md:w-1/2 flex items-center justify-center p-8 transition-all duration-500 
            ${isSignUp ? "opacity-0 invisible h-0 md:h-full overflow-hidden" : "opacity-100 visible h-auto md:h-full"}
            md:absolute md:left-0
          `}
          >
            <form className="w-full max-w-sm flex flex-col items-center">
              <Image
                src={Logo}
                alt="DMA"
                width={100}
                height={35}
                className="mb-6 md:mb-8"
              />
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-black tracking-tighter uppercase">
                Sign In
              </h1>

              <div className="flex gap-4 mb-8">
                {/* Facebook - Brand Blue */}
                <button
                  type="button"
                  className="p-3 border border-zinc-200 hover:border-[#1877F2] transition-colors text-[#1877F2]"
                >
                  <FaFacebook size={20} />
                </button>
                {/* Google - Multi-color (Simplified to Red/Google Brand) */}
                <button
                  type="button"
                  className="p-3 border border-zinc-200 hover:border-zinc-400 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </button>
                {/* Apple - Black/Dark Gray */}
                <button
                  type="button"
                  className="p-3 border border-zinc-200 hover:border-black transition-colors text-black"
                >
                  <FaApple size={20} />
                </button>
              </div>

              <div className="w-full space-y-4">
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-black outline-none transition-all text-black"
                  />
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-black outline-none transition-all text-black"
                  />
                </div>
              </div>

              <a
                href="#"
                className="text-[10px] text-zinc-400 mt-4 hover:text-black transition-colors uppercase tracking-widest"
              >
                Forgot Password?
              </a>

              <button
                type="submit"
                className="mt-8 bg-black text-white px-12 py-4 font-bold uppercase text-[10px] tracking-[0.3em] hover:brightness-125 transition-all"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Sign Up Form */}
          <div
            className={`
            w-full md:w-1/2 flex items-center justify-center p-8 transition-all duration-500
            ${!isSignUp ? "opacity-0 invisible h-0 md:h-full overflow-hidden" : "opacity-100 visible h-auto md:h-full"}
            md:absolute md:right-0
          `}
          >
            <form className="w-full max-w-sm flex flex-col items-center">
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-black tracking-tighter uppercase">
                Create Account
              </h1>

              <div className="w-full space-y-4">
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-[#006241] outline-none transition-all text-black"
                  />
                </div>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-[#006241] outline-none transition-all text-black"
                  />
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-[#006241] outline-none transition-all text-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-10 bg-[#006241] text-white px-12 py-4 font-bold uppercase text-[10px] tracking-[0.3em] hover:brightness-110 transition-all"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

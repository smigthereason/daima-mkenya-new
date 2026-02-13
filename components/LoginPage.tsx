// "use client";

// import React, { useState, useRef } from "react";
// import { Mail, Lock, User } from "lucide-react";
// import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa6";
// import Image from "next/image";
// import { Logo, HeroImage2 } from "@/public/assets";

// const Login = () => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const toggleForm = () => {
//     setIsSignUp(!isSignUp);
//   };

//   return (
//     <div className="min-h-screen bg-[#f8f8f8] flex items-start md:items-center justify-center p-0 md:p-8 font-sans mt-32">
//       {/* Main Container */}
//       <div
//         ref={containerRef}
//         className="relative w-full max-w-250 mt-20 md:mt-0 min-h-screen md:min-h-0 md:h-162.5 bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-100"
//       >
//         {/* Animated Overlay Panel */}
//         <div
//           className={`
//             relative md:absolute inset-y-0 w-full md:w-1/2 z-30 flex flex-col justify-center items-center text-white px-8 py-12 md:px-12 text-center transition-all duration-700 ease-in-out
//             ${isSignUp ? "md:left-0" : "md:left-1/2"}
//           `}
//           style={{
//             background: `linear-gradient(135deg, #000000 0%, #be1e2d 50%, #006241 100%)`,
//           }}
//         >
//           <div className="relative z-10">
//             <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tighter mb-4 uppercase italic">
//               {isSignUp ? "Welcome Back" : "Join the Legacy"}
//             </h2>
//             <p className="text-white/80 text-xs md:text-sm tracking-widest mb-8 leading-relaxed uppercase max-w-75">
//               {isSignUp
//                 ? "To stay connected with the heritage, please login with your personal info."
//                 : "Enter your personal details and start your journey with Daima Mkenya Africa."}
//             </p>
//             <button
//               onClick={toggleForm}
//               className="px-10 py-3 border border-white/40 hover:bg-white hover:text-black transition-all duration-500 uppercase text-[10px] font-bold tracking-[0.3em]"
//             >
//               {isSignUp ? "Sign In" : "Sign Up"}
//             </button>
//           </div>

//           <div className="absolute inset-0 opacity-10 pointer-events-none">
//             <Image
//               src={HeroImage2}
//               alt="Pattern"
//               fill
//               className="object-cover grayscale"
//             />
//           </div>
//         </div>

//         {/* Form Sections Container */}
//         <div className="grow md:flex-none md:w-full h-full relative bg-white">
//           {/* Sign In Form */}
//           <div
//             className={`
//             w-full md:w-1/2 flex items-center justify-center p-8 transition-all duration-500 
//             ${isSignUp ? "opacity-0 invisible h-0 md:h-full overflow-hidden" : "opacity-100 visible h-auto md:h-full"}
//             md:absolute md:left-0
//           `}
//           >
//             <form className="w-full max-w-sm flex flex-col items-center">
//               <Image
//                 src={Logo}
//                 alt="DMA"
//                 width={100}
//                 height={35}
//                 className="mb-6 md:mb-8"
//               />
//               <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-black tracking-tighter uppercase">
//                 Sign In
//               </h1>

//               <div className="flex gap-4 mb-8">
//                 {/* Facebook - Brand Blue */}
//                 <button
//                   type="button"
//                   className="p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
//                 >
//                   <FaFacebook size={20} />
//                 </button>

//                 {/* Google - Multi-color */}
//                 <button
//                   type="button"
//                   className="p-3 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95 hover:text-black"
//                 >
//                   <FaGoogle size={20} />
//                 </button>

//                 {/* Apple - Black/Dark Gray */}
//                 <button
//                   type="button"
//                   className="p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
//                 >
//                   <FaApple size={20} />
//                 </button>
//               </div>

//               <div className="w-full space-y-4">
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-black outline-none transition-all text-black"
//                   />
//                 </div>
//                 <div className="relative">
//                   <Lock
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
//                     size={18}
//                   />
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-black outline-none transition-all text-black"
//                   />
//                 </div>
//               </div>

//               <a
//                 href="#"
//                 className="text-[10px] text-zinc-400 mt-4 mb-4 hover:text-black transition-colors uppercase tracking-widest"
//               >
//                 Forgot Password?
//               </a>

//               <button
//                 type="submit"
//                 className="group relative overflow-hidden cursor-pointer border-[1px] border-black bg-black px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-500 hover:bg-transparent"
//               >
//                 {/* The "Grow" Background Layer - White slides up */}
//                 <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />

//                 {/* The Text Layer - Changes to black on hover */}
//                 <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
//                   Sign In
//                 </span>
//               </button>
//             </form>
//           </div>

//           {/* Sign Up Form */}
//           <div
//             className={`
//             w-full md:w-1/2 flex items-center justify-center p-8 transition-all duration-500
//             ${!isSignUp ? "opacity-0 invisible h-0 md:h-full overflow-hidden" : "opacity-100 visible h-auto md:h-full"}
//             md:absolute md:right-0
//           `}
//           >
//             <form className="w-full max-w-sm flex flex-col items-center">
//               <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-black tracking-tighter uppercase">
//                 Create Account
//               </h1>

//               <div className="w-full space-y-4">
//                 <div className="relative">
//                   <User
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Full Name"
//                     className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-[#006241] outline-none transition-all text-black"
//                   />
//                 </div>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-[#006241] outline-none transition-all text-black"
//                   />
//                 </div>
//                 <div className="relative">
//                   <Lock
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
//                     size={18}
//                   />
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 focus:ring-1 focus:ring-[#006241] outline-none transition-all text-black"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="mt-10 bg-[#006241] text-white px-12 py-4 font-bold uppercase text-[10px] tracking-[0.3em] hover:brightness-110 transition-all"
//               >
//                 Sign Up
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
"use client";

import React, { useState, useRef } from "react";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { Logo, HeroImage2 } from "@/public/assets";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-start md:items-center justify-center p-0 md:p-8 font-sans mt-16 md:mt-32 relative">
      {/* Main Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-250 mt-0 md:mt-0 min-h-screen md:min-h-0 md:h-162.5 bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-100"
      >
        {/* Form Sections Container - Mobile First: Forms at top */}
        <div className="grow md:flex-none md:w-full h-full relative bg-white order-1 md:order-2">
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
                {/* Facebook */}
                <button
                  type="button"
                  className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    <FaFacebook size={20} />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-[#1877f2] transition-transform duration-300 ease-out group-hover:translate-y-0" />
                </button>

                {/* Google */}
                <button
                  type="button"
                  className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    <FaGoogle size={20} />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-[#DB4437] transition-transform duration-300 ease-out group-hover:translate-y-0" />
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    <FaApple size={20} />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 ease-out group-hover:translate-y-0" />
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
                className="group relative overflow-hidden text-[10px] text-zinc-400 mt-4 mb-4 hover:text-black transition-colors uppercase tracking-widest"
              >
                <span className="relative z-10">Forgot Password?</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
              </a>

              <button
                type="submit"
                className="group relative overflow-hidden cursor-pointer border-[1px] border-black bg-black px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-500"
              >
                {/* White slide-up background */}
                <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
                {/* Text that changes color */}
                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                  Sign In
                </span>
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
              <Image
                src={Logo}
                alt="DMA"
                width={100}
                height={35}
                className="mb-6 md:mb-8"
              />
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-black tracking-tighter uppercase">
                Create Account
              </h1>

              <div className="flex gap-4 mb-8">
                {/* Facebook */}
                <button
                  type="button"
                  className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    <FaFacebook size={20} />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-[#1877f2] transition-transform duration-300 ease-out group-hover:translate-y-0" />
                </button>

                {/* Google */}
                <button
                  type="button"
                  className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    <FaGoogle size={20} />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-[#DB4437] transition-transform duration-300 ease-out group-hover:translate-y-0" />
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    <FaApple size={20} />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 ease-out group-hover:translate-y-0" />
                </button>
              </div>

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
                className="group relative overflow-hidden cursor-pointer border-[1px] border-[#006241] bg-[#006241] px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-500 mt-10"
              >
                {/* White slide-up background */}
                <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
                {/* Text that changes color */}
                <span className="relative z-10 transition-colors duration-500 group-hover:text-[#006241]">
                  Sign Up
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Animated Overlay Panel - Mobile: At bottom, Desktop: Side panel */}
        <div
          className={`
            relative md:absolute inset-y-0 w-full md:w-1/2 z-30 flex flex-col justify-center items-center text-white px-8 py-12 md:px-12 text-center transition-all duration-700 ease-in-out order-2 md:order-1
            ${isSignUp ? "md:left-0" : "md:left-1/2"}
          `}
          style={{
            background: `linear-gradient(135deg, #000000 0%, #be1e2d 50%, #006241 100%)`,
          }}
        >
          <div className="relative z-10 flex flex-col items-center w-full">
            <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tighter mb-4 uppercase italic">
              {isSignUp ? "Welcome Back" : "Join the Legacy"}
            </h2>
            <p className="text-white/80 text-xs md:text-sm tracking-widest mb-8 leading-relaxed uppercase max-w-75">
              {isSignUp
                ? "To stay connected with the heritage, please login with your personal info."
                : "Enter your personal details and start your journey with Daima Mkenya Africa."}
            </p>
            
            {/* Switch Button */}
            <button
              onClick={toggleForm}
              className="group relative overflow-hidden cursor-pointer border-[1px] border-white/40 bg-transparent px-10 py-3 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-500 mb-6"
            >
              {/* White slide-up background */}
              <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
              {/* Text that changes color */}
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </button>

            {/* Back to Home Button - Now inside panel below switch button */}
            <Link
              href="/"
              className="group relative overflow-hidden cursor-pointer border-[1px] border-white/20 bg-white/10 backdrop-blur-sm px-6 py-2 text-[8px] font-bold tracking-[0.2em] uppercase text-white/90 transition-all duration-500 hover:border-white/40 flex items-center gap-2 mt-2"
            >
              {/* White slide-up background */}
              <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
              {/* Icon and text */}
              <ArrowLeft size={14} className="relative z-10 transition-colors duration-500 group-hover:text-black" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                Back to Home
              </span>
            </Link>
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
      </div>
    </div>
  );
};

export default Login;
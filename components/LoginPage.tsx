// "use client";

// import React, { useState, useRef } from "react"
// import { Mail, Lock, User, ArrowLeft } from "lucide-react";
// import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa6";
// import Image from "next/image";
// import Link from "next/link";
// import { Logo, HeroImage2 } from "@/public/assets";
// import { signIn } from "next-auth/react";

// const Login = () => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const toggleForm = () => {
//     setIsSignUp(!isSignUp);
//   };

//   return (
//     <div className="min-h-screen  flex items-start md:items-center justify-center p-0 md:p-8 font-sans  relative">
//       {/* Main Container */}
//       <div
//         ref={containerRef}
//         className="relative w-full max-w-250 mt-0 md:mt-0 min-h-screen md:min-h-0 md:h-162.5 bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-100"
//       >
//         {/* Form Sections Container - Mobile First: Forms at top */}
//         <div className="grow md:flex-none md:w-full h-full relative bg-white order-1 md:order-2">
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
//                 {/* Facebook */}
//                 <button
//                   type="button"
//                   onClick={() => signIn('facebook', { callbackUrl: '/' })}
//                   className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
//                 >
//                   <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
//                     <FaFacebook size={20} />
//                   </span>
//                   <span className="absolute inset-0 z-0 translate-y-full bg-[#1877f2] transition-transform duration-300 ease-out group-hover:translate-y-0" />
//                 </button>

//                 {/* Google */}
//                 <button
//                   type="button"
//                   onClick={() => signIn('google', { callbackUrl: '/' })}
//                   className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
//                 >
//                   <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
//                     <FaGoogle size={20} />
//                   </span>
//                   <span className="absolute inset-0 z-0 translate-y-full bg-[#DB4437] transition-transform duration-300 ease-out group-hover:translate-y-0" />
//                 </button>

//                 {/* Apple */}
//                 <button
//                   type="button"
//                   className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
//                 >
//                   <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
//                     <FaApple size={20} />
//                   </span>
//                   <span className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 ease-out group-hover:translate-y-0" />
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
//                 className="group relative overflow-hidden text-[10px] text-zinc-400 mt-4 mb-4 hover:text-black transition-colors uppercase tracking-widest"
//               >
//                 <span className="relative z-10">Forgot Password?</span>
//                 <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
//               </a>

//               <button
//                 type="submit"
//                 className="group relative overflow-hidden cursor-pointer border-[1px] border-black bg-black px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-500"
//               >
//                 {/* White slide-up background */}
//                 <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
//                 {/* Text that changes color */}
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
//               <Image
//                 src={Logo}
//                 alt="DMA"
//                 width={100}
//                 height={35}
//                 className="mb-6 md:mb-8"
//               />
//               <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-black tracking-tighter uppercase">
//                 Create Account
//               </h1>

//               <div className="flex gap-4 mb-8">
//                 {/* Facebook */}
//                 <button
//                   type="button"
//                   onClick={() => signIn('facebook', { callbackUrl: '/' })}
//                   className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
//                 >
//                   <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
//                     <FaFacebook size={20} />
//                   </span>
//                   <span className="absolute inset-0 z-0 translate-y-full bg-[#1877f2] transition-transform duration-300 ease-out group-hover:translate-y-0" />
//                 </button>

//                 {/* Google */}
//                 <button
//                   type="button"
//                   onClick={() => signIn('google', { callbackUrl: '/' })}
//                   className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
//                 >
//                   <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
//                     <FaGoogle size={20} />
//                   </span>
//                   <span className="absolute inset-0 z-0 translate-y-full bg-[#DB4437] transition-transform duration-300 ease-out group-hover:translate-y-0" />
//                 </button>

//                 {/* Apple */}
//                 <button
//                   type="button"
//                   className="group relative overflow-hidden cursor-pointer p-3 border border-zinc-200 hover:border-black transition-all duration-300 ease-out text-black hover:scale-110 active:scale-95"
//                 >
//                   <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
//                     <FaApple size={20} />
//                   </span>
//                   <span className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 ease-out group-hover:translate-y-0" />
//                 </button>
//               </div>

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
//                 className="group relative overflow-hidden cursor-pointer border-[1px] border-[#006241] bg-[#006241] px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-500 mt-10"
//               >
//                 {/* White slide-up background */}
//                 <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
//                 {/* Text that changes color */}
//                 <span className="relative z-10 transition-colors duration-500 group-hover:text-[#006241]">
//                   Sign Up
//                 </span>
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Animated Overlay Panel - RESTORED ORIGINAL DESIGN */}
//         <div
//           className={`
//             relative md:absolute inset-y-0 w-full md:w-1/2 z-30 flex flex-col justify-center items-center text-white px-8 py-12 md:px-12 text-center transition-all duration-700 ease-in-out order-2 md:order-1
//             ${isSignUp ? "md:left-0" : "md:left-1/2"}
//           `}
//           style={{
//             background: `linear-gradient(135deg, #000000 0%, #be1e2d 50%, #006241 100%)`,
//           }}
//         >
//           <div className="relative z-10 flex flex-col items-center w-full">
//             <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tighter mb-4 uppercase italic">
//               {isSignUp ? "Welcome Back" : "Join the Legacy"}
//             </h2>
//             <p className="text-white/80 text-xs md:text-sm tracking-widest mb-8 leading-relaxed uppercase max-w-75">
//               {isSignUp
//                 ? "To stay connected with the heritage, please login with your personal info."
//                 : "Enter your personal details and start your journey with Daima Mkenya Africa."}
//             </p>
            
//             {/* Switch Button */}
//             <button
//               onClick={toggleForm}
//               className="group relative overflow-hidden cursor-pointer border-[1px] border-white/40 bg-transparent px-10 py-3 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-500 mb-6"
//             >
//               {/* White slide-up background */}
//               <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
//               {/* Text that changes color */}
//               <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
//                 {isSignUp ? "Sign In" : "Sign Up"}
//               </span>
//             </button>

//             {/* Back to Home Button */}
//             <Link
//               href="/"
//               className="group relative overflow-hidden cursor-pointer border-[1px] border-white/20 bg-white/10 backdrop-blur-sm px-6 py-2 text-[8px] font-bold tracking-[0.2em] uppercase text-white/90 transition-all duration-500 hover:border-white/40 flex items-center gap-2 mt-2"
//             >
//               {/* White slide-up background */}
//               <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
//               {/* Icon and text */}
//               <ArrowLeft size={14} className="relative z-10 transition-colors duration-500 group-hover:text-black" />
//               <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
//                 Back to Home
//               </span>
//             </Link>
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
//       </div>
//     </div>
//   );
// };

// export default Login;

"use client";

import React, { useState, useRef } from "react"
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { Logo, HeroImage2 } from "@/public/assets";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  // Fix 1 & 5: Centralized Auth Redirecting to Home
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      name,
      redirect: false, // Prevents flashing/automatic redirect to /profile
    });

    if (result?.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("Authentication failed. Please check your credentials.");
      setLoading(false);
    }
  };

  const socialSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  // Reusable Social Icons Component to keep code clean inside your layout
  const SocialSection = () => (
    <div className="flex gap-4 mb-8">
      <button 
        type="button" 
        onClick={() => socialSignIn('facebook')}
        className="group relative overflow-hidden p-3 border border-zinc-200 hover:border-black transition-all text-black hover:scale-110"
      >
        <span className="relative z-10 group-hover:text-white transition-colors duration-300"><FaFacebook size={20} /></span>
        <span className="absolute inset-0 z-0 translate-y-full bg-[#1877f2] transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
      </button>
      <button 
        type="button" 
        onClick={() => socialSignIn('google')}
        className="group relative overflow-hidden p-3 border border-zinc-200 hover:border-zinc-400 transition-all text-black hover:scale-110"
      >
        <span className="relative z-10 group-hover:text-white transition-colors duration-300"><FaGoogle size={20} /></span>
        <span className="absolute inset-0 z-0 translate-y-full bg-[#DB4437] transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
      </button>
      <button 
        type="button" 
        onClick={() => socialSignIn('apple')}
        className="group relative overflow-hidden p-3 border border-zinc-200 hover:border-black transition-all text-black hover:scale-110"
      >
        <span className="relative z-10 group-hover:text-white transition-colors duration-300"><FaApple size={20} /></span>
        <span className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-start md:items-center justify-center p-0 md:p-8 font-sans  relative">
      <div
        ref={containerRef}
        className="relative w-full max-w-250 mt-0 md:mt-0 min-h-screen md:min-h-0 md:h-162.5 bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-100"
      >
        <div className="grow md:flex-none md:w-full h-full relative bg-white order-1 md:order-2">
          
          {/* SIGN IN FORM */}
          <div className={`w-full md:w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out ${isSignUp ? "opacity-0 invisible h-0 md:h-full overflow-hidden" : "opacity-100 visible h-auto md:h-full"} md:absolute md:left-0`}>
            <form onSubmit={handleAuth} className="w-full max-w-sm flex flex-col items-center">
              <Image src={Logo} alt="DMA" width={100} height={35} className="mb-8" />
              <h1 className="text-3xl font-serif font-black mb-6 text-black tracking-tighter uppercase">Sign In</h1>
              
              {/* Fix 2: Social Icons on Sign In */}
              <SocialSection />

              <div className="w-full space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 outline-none text-black focus:ring-1 focus:ring-black/5" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-100 border-none py-4 pl-12 pr-12 outline-none text-black focus:ring-1 focus:ring-black/5" />
                  {/* Fix 3: Eye Toggle */}
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="group relative overflow-hidden border border-black bg-black px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white mt-8 w-full md:w-auto">
                <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                  {loading ? "Authenticating..." : "Sign In"}
                </span>
              </button>
            </form>
          </div>

          {/* SIGN UP FORM */}
          <div className={`w-full md:w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out ${!isSignUp ? "opacity-0 invisible h-0 md:h-full overflow-hidden" : "opacity-100 visible h-auto md:h-full"} md:absolute md:right-0`}>
            <form onSubmit={handleAuth} className="w-full max-w-sm flex flex-col items-center">
              <Image src={Logo} alt="DMA" width={100} height={35} className="mb-8" />
              <h1 className="text-3xl font-serif font-black mb-6 text-black tracking-tighter uppercase">Create Account</h1>
              
              {/* Fix 2: Social Icons on Create Account */}
              <SocialSection />

              <div className="w-full space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 outline-none text-black" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 outline-none text-black" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-100 border-none py-4 pl-12 pr-12 outline-none text-black" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="group relative overflow-hidden border border-[#006241] bg-[#006241] px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white mt-10 w-full md:w-auto">
                <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
                <span className="relative z-10 transition-colors duration-500 group-hover:text-[#006241]">
                  {loading ? "Creating..." : "Sign Up"}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* OVERLAY */}
        <div 
          className={`relative md:absolute inset-y-0 w-full md:w-1/2 z-30 flex flex-col justify-center items-center text-white px-8 py-12 md:px-12 text-center transition-all duration-700 ease-in-out order-2 md:order-1 ${isSignUp ? "md:left-0" : "md:left-1/2"}`}
          style={{ background: `linear-gradient(135deg, #000000 0%, #be1e2d 50%, #006241 100%)` }}
        >
          <div className="relative z-10 flex flex-col items-center w-full">
            <h2 className="text-4xl font-serif font-black tracking-tighter mb-4 uppercase italic">
              {isSignUp ? "Welcome Back" : "Join the Legacy"}
            </h2>
            <p className="text-white/80 text-[10px] tracking-widest mb-8 leading-relaxed uppercase max-w-75">
              {isSignUp ? "To stay connected with the heritage, please login." : "Enter your personal details and start your journey with us."}
            </p>
            <button onClick={toggleForm} className="group relative overflow-hidden border border-white/40 bg-transparent px-10 py-3 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-500 mb-6">
              <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </button>

            <Link href="/" className="group relative overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm px-6 py-2 text-[8px] font-bold tracking-[0.2em] uppercase text-white/90 transition-all duration-500 flex items-center gap-2">
              <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
              <ArrowLeft size={14} className="relative z-10 transition-colors duration-500 group-hover:text-black" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">Back to Home</span>
            </Link>
          </div>
          <div className="absolute inset-0 opacity-10 pointer-events-none grayscale">
            <Image src={HeroImage2} alt="Pattern" fill className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
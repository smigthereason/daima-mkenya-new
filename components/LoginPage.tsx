"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { Logo, HeroImage2 } from "@/public/assets";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe client-side state for redirection
  const [redirectTo, setRedirectTo] = useState("/");
  const isNavigating = useRef(false);

  useEffect(() => {
    // This only runs on the client, fixing the ReferenceError: sessionStorage is not defined
    if (typeof window !== "undefined") {
      const callbackUrl = searchParams.get("callbackUrl");
      const storedRedirect = sessionStorage.getItem("redirectAfterLogin");
      setRedirectTo(callbackUrl || storedRedirect || "/");
    }
  }, [searchParams]);

  // Handle automatic redirect if session already exists
  useEffect(() => {
    if (status === "loading" || isNavigating.current) return;

    if (session?.user) {
      isNavigating.current = true;
      const isAdmin =
        session.user.isAdmin ||
        session.user?.role === "admin" ||
        session.user?.email === "prodbysmig@gmail.com";

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("redirectAfterLogin");
        // We use window.location.href to force the browser to navigate immediately
        // and show the native progress bar, which fixes the "stuck button" issue.
        window.location.href = isAdmin ? "/admin" : redirectTo;
      }
    }
  }, [session, status, redirectTo]);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        ...(isSignUp && { name }),
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error,
        );
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Trigger a session update. The useEffect above will handle the redirect
        // once the session is updated with user data.
        await update();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const socialSignIn = async (provider: string) => {
    setLoading(true);
    setError(null);
    try {
      await signIn(provider, {
        callbackUrl: redirectTo,
        redirect: true,
      });
    } catch (error) {
      console.error("Social sign in error:", error);
      setError("Social sign in failed");
      setLoading(false);
    }
  };

  const SocialSection = () => (
    <div className="flex gap-4 mb-8">
      <button
        type="button"
        onClick={() => socialSignIn("facebook")}
        disabled={loading}
        className="group relative overflow-hidden p-3 border border-zinc-200 hover:border-black transition-all text-black hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
          <FaFacebook size={20} />
        </span>
        <span className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
      </button>
      <button
        type="button"
        onClick={() => socialSignIn("google")}
        disabled={loading}
        className="group relative overflow-hidden p-3 border border-zinc-200 hover:border-black transition-all text-black hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
          <FaGoogle size={20} />
        </span>
        <span className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
      </button>
      <button
        type="button"
        onClick={() => socialSignIn("apple")}
        disabled={loading}
        className="group relative overflow-hidden p-3 border border-zinc-200 hover:border-black transition-all text-black hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
          <FaApple size={20} />
        </span>
        <span className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
      </button>
    </div>
  );

  // Loading or Authenticated state splash
  if (status === "loading" || (status === "authenticated" && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-start md:items-center justify-center mt-0 p-0  font-sans relative">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl mt-0 md:mt-0 min-h-screen md:min-h-0 md:h-[650px] bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-100"
      >
        {/* FORM SIDE */}
        <div className="grow md:flex-none md:w-full h-full relative bg-white order-1 md:order-2">
          {/* SIGN IN FORM CONTAINER */}
          <div
            className={`w-full md:w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out ${
              isSignUp
                ? "opacity-0 invisible h-0 md:h-full overflow-hidden"
                : "opacity-100 visible h-auto md:h-full"
            } md:absolute md:left-0`}
          >
            <form
              onSubmit={handleAuth}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <Image
                src={Logo}
                alt="DMA"
                width={100}
                height={35}
                className="mb-8"
              />
              <h1 className="text-3xl font-serif font-black mb-6 text-black tracking-tighter uppercase">
                Sign In
              </h1>

              <SocialSection />

              {error && (
                <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider text-center rounded">
                  {error}
                </div>
              )}

              <div className="w-full space-y-4">
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 outline-none text-black focus:ring-1 focus:ring-black/5"
                  />
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-12 outline-none text-black focus:ring-1 focus:ring-black/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden border border-black bg-black px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white mt-8 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                  {loading ? "Authenticating..." : "Sign In"}
                </span>
              </button>
            </form>
          </div>

          {/* SIGN UP FORM CONTAINER */}
          <div
            className={`w-full md:w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out ${
              !isSignUp
                ? "opacity-0 invisible h-0 md:h-full overflow-hidden"
                : "opacity-100 visible h-auto md:h-full"
            } md:absolute md:right-0`}
          >
            <form
              onSubmit={handleAuth}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <Image
                src={Logo}
                alt="DMA"
                width={100}
                height={35}
                className="mb-8"
              />
              <h1 className="text-3xl font-serif font-black mb-6 text-black tracking-tighter uppercase">
                Create Account
              </h1>

              <SocialSection />

              {error && (
                <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider text-center rounded">
                  {error}
                </div>
              )}

              <div className="w-full space-y-4">
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 outline-none text-black"
                  />
                </div>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-4 outline-none text-black"
                  />
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-zinc-100 border-none py-4 pl-12 pr-12 outline-none text-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden border border-[#006241] bg-[#006241] px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white mt-10 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
                <span className="relative z-10 transition-colors duration-500 group-hover:text-[#006241]">
                  {loading ? "Creating Account..." : "Sign Up"}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* OVERLAY SECTION */}
        <div
          className={`relative md:absolute inset-y-0 w-full md:w-1/2 z-30 flex flex-col justify-center items-center text-white px-8 py-12 md:px-12 text-center transition-all duration-700 ease-in-out order-2 md:order-1 ${
            isSignUp ? "md:left-0" : "md:left-1/2"
          }`}
          style={{
            background: `linear-gradient(135deg, #000000 0%, #be1e2d 50%, #006241 100%)`,
          }}
        >
          <div className="relative z-10 flex flex-col items-center w-full">
            <h2 className="text-4xl font-serif font-black tracking-tighter mb-4 uppercase italic">
              {isSignUp ? "Welcome Back" : "Join the Legacy"}
            </h2>
            <p className="text-white/80 text-[10px] tracking-widest mb-8 leading-relaxed uppercase max-w-75">
              {isSignUp
                ? "To stay connected with the heritage, please login."
                : "Enter your personal details and start your journey with us."}
            </p>
            <button
              onClick={toggleForm}
              className="group relative overflow-hidden border border-white/40 bg-transparent px-10 py-3 text-[10px] font-bold tracking-[0.3em] uppercase text-white transition-all duration-500 mb-6"
            >
              <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </button>

            <Link
              href="/"
              className="group relative overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm px-6 py-2 text-[8px] font-bold tracking-[0.2em] uppercase text-white/90 transition-all duration-500 flex items-center gap-2"
            >
              <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
              <ArrowLeft
                size={14}
                className="relative z-10 transition-colors duration-500 group-hover:text-black"
              />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                Back to Home
              </span>
            </Link>
          </div>
          <div className="absolute inset-0 opacity-10 pointer-events-none grayscale">
            <Image
              src={HeroImage2}
              alt="Pattern"
              fill
              className="object-cover"
              sizes="50vw"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

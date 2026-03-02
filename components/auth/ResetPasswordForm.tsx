// components/auth/ResetPasswordForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full p-5 bg-neutral-50 border border-neutral-100 rounded-none text-sm tracking-widest focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all";
  const labelClasses =
    "text-[11px] font-black text-neutral-900 uppercase tracking-[0.3em] flex items-center gap-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-red-600" />
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-green-600" />
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-green-700">
              Password reset successfully! Redirecting to login...
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className={labelClasses}>
          <Lock size={14} className="text-[#be1e2d]" /> New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClasses}
          placeholder="Min. 8 characters"
          required
          disabled={isLoading || success}
        />
      </div>

      <div className="space-y-3">
        <label className={labelClasses}>
          <Lock size={14} className="text-[#be1e2d]" /> Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClasses}
          placeholder="Re-enter new password"
          required
          disabled={isLoading || success}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || success}
        className="relative w-full overflow-hidden bg-black py-6 text-[12px] font-black uppercase tracking-[0.4em] text-white transition-all group mt-8"
      >
        <div className="absolute inset-0 bg-[#be1e2d] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <Save size={16} /> Reset Password
            </>
          )}
        </span>
      </button>
    </form>
  );
}

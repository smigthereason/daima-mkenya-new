// app/reset-password/page.tsx
import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tighter uppercase leading-[0.9] mb-4">
            Reset <span className="font-black">Password</span>
          </h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
            Enter your new password below
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

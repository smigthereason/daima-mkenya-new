// app/login/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import LoginPage from "@/components/LoginPage";

export const metadata: Metadata = {
  title: "Login | Daima Mkenya Africa",
  description:
    "Sign in or create an account to access premium fashion products",
};

// Loading fallback for Suspense
function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
      <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPage />
    </Suspense>
  );
}

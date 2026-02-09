// app/products/page.tsx
import LoginPage from "@/components/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Daima Mkenya Africa",
  description: "Sign up for premium fashion products",
};

export default function Page() {
  return <LoginPage />;
}

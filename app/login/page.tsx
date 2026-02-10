import LoginPage from "@/components/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Daima Mkenya Africa",
  description: "Sign Up our premium fashion products",
};

export default function Page() {
  return <LoginPage />;
}

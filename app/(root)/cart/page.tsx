"use client";

import { useRouter } from "next/navigation";
import CartPage from "@/components/CartPage";

export default function Page() {
  const router = useRouter();

  return (
    <main>
      <CartPage
        onBack={() => router.push("/products")}
        onCheckout={() => router.push("/checkout")}
      />
    </main>
  );
}
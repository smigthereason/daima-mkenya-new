// app/products/page.tsx
import ProductPage from "@/components/ProductPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Daima Mkenya Africa",
  description: "View our premium fashion products",
};

export default function Page() {
  return <ProductPage />;
}

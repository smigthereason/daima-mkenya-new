// app/gallery/page.tsx
import GalleryPage from "@/components/GalleryPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Daima Mkenya Africa",
  description: "View our premium fashion products",
};

export default function Page() {
  return <GalleryPage />;
}

// app/profile/page.tsx
import ProfilePage from "@/components/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Daima Mkenya Africa",
  description: "Your heritage account and order history.",
};

export default function Page() {
  return <ProfilePage />;
}
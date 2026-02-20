import SearchPage from "@/components/SearchPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | Daima Mkenya Africa",
  description: "Search our collection of heartbeat pieces worn proudly.",
};

export default function Page() {
  return <SearchPage />;
}
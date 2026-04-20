import type { Metadata } from "next";
import HomeDashboard from "./home-dashboard";

export const metadata: Metadata = {
  title: "Home | Ansh Links",
  description: "Manage your ANSH digital identity and cards.",
};

export default function CreatorHomePage() {
  return <HomeDashboard />;
}

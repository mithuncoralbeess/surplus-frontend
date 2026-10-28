import { Metadata } from "next";
import MaintenanceWidget from "../widgets/Maintenance";

export const metadata: Metadata = {
  title: "Under Maintenance | Surplus Market",
  description: "Surplus Market is currently undergoing scheduled infrastructure enhancements and database optimizations.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <MaintenanceWidget />
    </main>
  );
}

import KitchenRenovationBanner from "@/components/banner";
import Catalogue from "@/components/catalogue";
import Navigasi from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigasi />
      <KitchenRenovationBanner />
      <Catalogue />
    </div>
  );
}

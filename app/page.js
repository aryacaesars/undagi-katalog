import KitchenRenovationBanner from "@/components/banner";
import Catalogue from "@/components/catalogue";
import Navigasi from "@/components/navbar";
import Image from "next/image";

export const metadata = {
  title: "PT. Gurita Bisnis Undagi - Jasa Konstruksi & Renovasi Dapur Industri Terpercaya",
  description: "Spesialis jasa konstruksi dapur industri, renovasi dapur sehat MBG, pengadaan peralatan dapur komersial, instalasi utilitas (listrik, gas, air, ventilasi), dan pendampingan sertifikasi SLHS. Berpengalaman dalam proyek dapur sehat skala besar dengan jaminan mutu dan layanan purna jual responsif.",
  keywords: "jasa konstruksi dapur, renovasi dapur industri, peralatan dapur komersial, dapur sehat MBG, sertifikasi SLHS, instalasi utilitas dapur, konstruksi dapur restoran, kitchen equipment supplier, dapur komersial, undagi, PT Gurita Bisnis Undagi",
  openGraph: {
    title: "PT. Gurita Bisnis Undagi - Ahli Konstruksi Dapur Industri & Komersial",
    description: "Layanan konstruksi dan renovasi dapur industri terpercaya. Spesialis peralatan dapur komersial, instalasi utilitas lengkap, dan pendampingan sertifikasi laik higiene sanitasi (SLHS). Jaminan mutu dan waktu pelaksanaan terukur.",
    images: [
      {
        url: "/Logo.svg",
        width: 1200,
        height: 630,
        alt: "PT. Gurita Bisnis Undagi - Jasa Konstruksi Dapur Industri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT. Gurita Bisnis Undagi - Jasa Konstruksi Dapur Industri",
    description: "Spesialis konstruksi, renovasi dapur sehat, dan pengadaan peralatan dapur industri dengan jaminan mutu terpercaya.",
    images: ["/Logo.svg"],
  },
  alternates: {
    canonical: "https://katalog.undagicorp.com",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigasi />
      <KitchenRenovationBanner />
      <Catalogue />
    </div>
  );
}

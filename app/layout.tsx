import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AiShoppingAssistant } from "@/components/ai/AiShoppingAssistant";

export const metadata: Metadata = {
  title: "MarketSphere | Curated Multi-Vendor Global Marketplace",
  description:
    "Discover verified independent sellers, cutting-edge workstations, audio tech, ergonomic home living, and athletic apparel on MarketSphere with buyer protection and fast delivery.",
  keywords: ["e-commerce", "marketplace", "multi-vendor", "electronics", "fashion", "laptops", "headphones"],
  authors: [{ name: "MarketSphere Inc." }],
  openGraph: {
    title: "MarketSphere | Curated Multi-Vendor Global Marketplace",
    description: "Discover verified independent sellers with buyer protection and fast delivery.",
    url: "https://marketsphere.com",
    siteName: "MarketSphere",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketSphere | The Modern Multi-Vendor Marketplace",
    description: "Shop premium electronics, home goods, and athletic apparel from verified sellers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
        <AiShoppingAssistant />
      </body>
    </html>
  );
}

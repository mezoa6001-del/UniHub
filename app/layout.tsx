import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pharma Core — by Dr. Mazen Ashraf",
  description:
    "Master Pharmacology. Ace your exams. The complete pharmaceutical education platform.",
  keywords: [
    "pharmacology",
    "exam prep",
    "question bank",
    "medical education",
    "Dr. Mazen Ashraf",
  ],
  authors: [{ name: "Dr. Mazen Ashraf" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-512.png",
  },
  openGraph: {
    title: "Pharma Core",
    description: "Master Pharmacology. Ace your exams.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#2FA084",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans bg-[#0A1628] text-[#E8F0FE] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
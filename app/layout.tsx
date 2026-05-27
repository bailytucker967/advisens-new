import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Advisens — Report intelligence for GCC & international financial advisers",
  description:
    "Advisens learns the structure, language, and product universe of your existing reports. Every future client report is pre-populated, fact-checked, and ready to ship in minutes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden bg-[#0a0e16]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden min-w-0 bg-[#0a0e16]`}
      >
        {children}
      </body>
    </html>
  );
}

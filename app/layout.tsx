import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

// Clean UI / body sans
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TWI Report Generator · Titan Wealth International",
  description:
    "The in-house report engine for Titan Wealth advisers. Turn a client meeting into a finished, on-brand wealth report in minutes.",
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
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased overflow-x-hidden min-w-0`}
      >
        {children}
      </body>
    </html>
  );
}

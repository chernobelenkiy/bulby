import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import AppWrapper from "@/components/AppWrapper";

// Don't import i18n initialization here - we'll use the provider component

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Idea Generator - Unleash Your Creativity",
  description: "Generate innovative ideas with our AI-powered platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}

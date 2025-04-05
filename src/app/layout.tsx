import "./globals.css";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import AppWrapper from "@/components/AppWrapper";
import { NextAuthProvider } from "@/app/providers";
import UserProvider from "@/components/providers/UserProvider";

// Don't import i18n initialization here - we'll use the provider component

// Define fonts
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Idea Generator",
  description: "Generate creative ideas with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <NextAuthProvider>
          <UserProvider>
            <AppWrapper>
              {children}
            </AppWrapper>
          </UserProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

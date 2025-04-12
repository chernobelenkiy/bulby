import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import AppWrapper from "@/components/AppWrapper";
import { NextAuthProvider } from "@/app/providers";
import UserProvider from "@/components/providers/UserProvider";
import TelegramInitializer from "@/components/telegram/TelegramInitializer";

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
              <TelegramInitializer />
              {children}
            </AppWrapper>
          </UserProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono, Exo_2 } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Track crypto prices in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${exo2.variable} font-exo2 antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <ClientLayout>
        {children}
        </ClientLayout>
      </body>
    </html>
  );
}

import "../styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import Navbar from "./navbar";

export const metadata: Metadata = {
  title: "Saskatoon New Life Community Fellowship",
  description: "Church in Saskatoon",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`}>
      <body>
        <Navbar />

        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

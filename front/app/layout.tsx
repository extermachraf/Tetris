import type React from "react";
import type { Metadata } from "next";
import { Press_Start_2P, Roboto } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";
import ReduxWrapper from "@/components/ReduxWrapper";
import { usePathname } from "next/navigation";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Classic Tetris Reimagined",
  description: "Experience the iconic block-stacking game with modern features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} ${roboto.variable}`}>
        <div className="min-h-screen bg-tetris-bg text-foreground relative overflow-hidden">
          <div className="fixed inset-0 -z-50 grid-bg"></div>
          <ReduxWrapper>
            <NavBar />
            {children}
          </ReduxWrapper>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import dynamic from "next/dynamic";

import { store } from "@/lib/store";
import { Providers } from "@/lib/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.tsx

export const metadata = {
  title: "Movie Recommender App",
  description:
    "A web application that provides personalized movie recommendations based on user preferences and viewing history.",
};

const NavbarWrapper = dynamic(() => import("./navbar-wrapper"));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
         <Providers>
          <AuthProvider>
          <NavbarWrapper></NavbarWrapper>
          {children}
        </AuthProvider>
         </Providers>
        
      </body>
    </html>
  );
}
        
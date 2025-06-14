import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navigation from "@/components/auth/Navigation";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description: "あなただけの本を作ろう",
  title: "Novel Smith",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navigation />

          <main className="container mx-auto max-w-screen-md flex-1 px-2">
            {children}
          </main>
          <footer className="py-5">
            <div className="text-center text-sm">
              Copyright © All rights reserved |{" "}
              <a
                className="underline"
                href="https://github.com/OBookBook"
                rel="noopener noreferrer"
                target="_blank"
              >
                Naobe
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

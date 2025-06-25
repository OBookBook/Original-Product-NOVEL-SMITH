import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "../styles/globals.css";
import Providers from "@/components/providers/Providers";
import Navigation from "@/components/auth/Navigation";

const mPlusRounded = M_PLUS_Rounded_1c({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mplus-rounded",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  description: "あなただけの本を作ろう",
  title: "Novel Smith",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${mPlusRounded.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Providers>
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
          </Providers>
        </div>
      </body>
    </html>
  );
}

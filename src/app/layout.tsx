import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Open_Sans } from "next/font/google";
import Providers from "./providers";
import "@/styles/globals.css";

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

export const metadata: Metadata = {
  title: "AMKO",
  icons: { icon: "/amko.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={openSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

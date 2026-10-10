import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Open_Sans } from "next/font/google";
import Providers from "./providers";
import "@/styles/globals.css";

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

export const metadata: Metadata = {
  title: "amk",
  icons: { icon: "/amk.png" },
};

// Let the on-screen keyboard shrink the layout (where supported) so bottom sheets stay above it.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
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

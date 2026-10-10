import { Open_Sans } from "next/font/google";
import Providers from "./providers";
import "@/styles/global.css";

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

export const metadata = {
  title: "AMKO",
  icons: { icon: "/amko.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={openSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

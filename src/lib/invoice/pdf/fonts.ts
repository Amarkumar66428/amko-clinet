import { Font } from "@react-pdf/renderer";
import type { FontFamily } from "../types";

// Full (non-subset) Google Fonts TTFs. All three cover ₹ € £ ¥ $, which the PDF standard fonts do not.
// react-pdf subsets them on embed, so only the glyphs used end up in the PDF.
const FONT_FILES: Record<FontFamily, { regular: string; bold: string }> = {
  Inter: { regular: "Inter-Regular.ttf", bold: "Inter-Bold.ttf" },
  Roboto: { regular: "Roboto-Regular.ttf", bold: "Roboto-Bold.ttf" },
  "Noto Serif": { regular: "NotoSerif-Regular.ttf", bold: "NotoSerif-Bold.ttf" },
};

let registeredBase: string | null = null;

/** @param baseUrl URL (browser) or absolute directory (Node scripts) containing the font files. */
export function registerInvoiceFonts(baseUrl = "/fonts/invoice"): void {
  if (registeredBase === baseUrl) return;
  for (const [family, files] of Object.entries(FONT_FILES)) {
    Font.register({
      family,
      fonts: [
        { src: `${baseUrl}/${files.regular}`, fontWeight: 400 },
        { src: `${baseUrl}/${files.bold}`, fontWeight: 700 },
      ],
    });
  }
  // Never hyphenate: invoice numbers, emails and names must stay intact.
  Font.registerHyphenationCallback((word) => [word]);
  registeredBase = baseUrl;
}

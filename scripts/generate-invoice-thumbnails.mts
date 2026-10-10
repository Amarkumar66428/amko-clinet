/**
 * Renders every invoice template with sample data and writes gallery thumbnails to
 * public/invoice-templates/<id>.webp. Run after changing a template:
 *
 *   npm run invoice:thumbnails            # thumbnails only
 *   npm run invoice:thumbnails -- --pdf   # also write the full PDFs next to them for review
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import { createCanvas } from "@napi-rs/canvas";
import { renderToBuffer } from "@react-pdf/renderer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { InvoiceDocument } from "../src/lib/invoice/pdf/InvoiceDocument";
import { registerInvoiceFonts } from "../src/lib/invoice/pdf/fonts";
import { SAMPLE_INVOICE } from "../src/lib/invoice/sample";
import { INVOICE_TEMPLATES } from "../src/lib/invoice/templates";

// npm scripts run from the project root.
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "invoice-templates");
const THUMB_WIDTH = 600;

async function rasterizeFirstPage(pdf: Uint8Array): Promise<Buffer> {
  const task = getDocument({ data: pdf });
  const doc = await task.promise;
  try {
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: THUMB_WIDTH / page.getViewport({ scale: 1 }).width });
    const canvas = createCanvas(Math.floor(viewport.width), Math.floor(viewport.height));
    await page.render({ canvas: canvas as unknown as HTMLCanvasElement, viewport }).promise;
    return canvas.encode("webp", 85);
  } finally {
    await task.destroy();
  }
}

async function main() {
  registerInvoiceFonts(path.join(ROOT, "public", "fonts", "invoice"));
  await mkdir(OUT_DIR, { recursive: true });
  const writePdf = process.argv.includes("--pdf");

  for (const template of INVOICE_TEMPLATES) {
    const pdf = await renderToBuffer(
      createElement(InvoiceDocument, {
        templateId: template.id,
        invoice: SAMPLE_INVOICE,
        appearance: template.defaultAppearance,
      }) as Parameters<typeof renderToBuffer>[0],
    );
    const bytes = new Uint8Array(pdf);
    if (writePdf) await writeFile(path.join(OUT_DIR, `${template.id}.pdf`), bytes);
    await writeFile(path.join(OUT_DIR, `${template.id}.webp`), await rasterizeFirstPage(bytes.slice()));
    console.log(`✓ ${template.id} (${(bytes.byteLength / 1024).toFixed(1)} KB PDF)`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

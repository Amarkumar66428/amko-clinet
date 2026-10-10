import { createElement } from "react";
import type { InvoiceDocumentProps } from "./InvoiceDocument";

/**
 * Renders an invoice to a PDF Blob entirely in the browser.
 * react-pdf and the templates (~1 MB) are loaded on first use so they stay out of the page bundle.
 */
export async function renderInvoicePdf(props: InvoiceDocumentProps): Promise<Blob> {
  const [{ pdf }, { InvoiceDocument }, { registerInvoiceFonts }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./InvoiceDocument"),
    import("./fonts"),
  ]);
  registerInvoiceFonts();
  // InvoiceDocument renders a <Document>; pdf() is typed for a <Document> element directly.
  const element = createElement(InvoiceDocument, props) as unknown as Parameters<typeof pdf>[0];
  return pdf(element).toBlob();
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke later: some browsers (Safari) start the download asynchronously.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

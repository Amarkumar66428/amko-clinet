import { createElement } from "react";
import type { InvoiceDocumentProps } from "./InvoiceDocument";

/**
 * Renders an invoice to a PDF Blob in the current thread (a Web Worker, or the page as a fallback).
 * react-pdf and the templates (~1 MB) are loaded on first use so they stay out of the page bundle.
 */
export async function renderInvoicePdfHere(props: InvoiceDocumentProps, fontBaseUrl?: string): Promise<Blob> {
  const [{ pdf }, { InvoiceDocument }, { registerInvoiceFonts }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./InvoiceDocument"),
    import("./fonts"),
  ]);
  registerInvoiceFonts(fontBaseUrl);
  // InvoiceDocument renders a <Document>; pdf() is typed for a <Document> element directly.
  const element = createElement(InvoiceDocument, props) as unknown as Parameters<typeof pdf>[0];
  return pdf(element).toBlob();
}

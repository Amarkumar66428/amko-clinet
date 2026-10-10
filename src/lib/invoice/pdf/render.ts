import type { InvoiceDocumentProps } from "./InvoiceDocument";
import type { RenderRequest, RenderResponse } from "./pdf.worker";
import { renderInvoicePdfHere } from "./renderCore";

interface Pending {
  resolve: (pdf: Blob) => void;
  reject: (error: unknown) => void;
}

let worker: Worker | null = null;
/** Set once the worker fails to start; later renders then run on the page instead. */
let workerBroken = false;
let nextId = 0;
const pending = new Map<number, Pending>();

function failAll(error: unknown) {
  for (const { reject } of pending.values()) reject(error);
  pending.clear();
}

function getWorker(): Worker | null {
  if (workerBroken || typeof Worker === "undefined") return null;
  if (worker) return worker;
  try {
    worker = new Worker(new URL("./pdf.worker.ts", import.meta.url), { type: "module" });
  } catch (error) {
    console.warn("PDF worker unavailable, rendering on the main thread:", error);
    workerBroken = true;
    return null;
  }
  worker.onmessage = ({ data }: MessageEvent<RenderResponse>) => {
    const request = pending.get(data.id);
    if (!request) return;
    pending.delete(data.id);
    if ("pdf" in data) request.resolve(data.pdf);
    else request.reject(new Error(data.error));
  };
  // A load/script error means the worker itself is unusable (e.g. blocked by CSP): fall back for good.
  worker.onerror = (event) => {
    console.warn("PDF worker failed, rendering on the main thread:", event.message);
    event.preventDefault();
    workerBroken = true;
    worker?.terminate();
    worker = null;
    failAll(new Error("PDF worker failed"));
  };
  return worker;
}

/**
 * Renders an invoice to a PDF Blob. Runs in a shared Web Worker so the editor stays responsive,
 * falling back to the main thread where workers aren't available.
 */
export async function renderInvoicePdf(props: InvoiceDocumentProps): Promise<Blob> {
  const target = getWorker();
  if (!target) return renderInvoicePdfHere(props);
  try {
    return await new Promise<Blob>((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      target.postMessage({ id, props } satisfies RenderRequest);
    });
  } catch (error) {
    // The worker died mid-render: retry once on the main thread rather than surfacing an error.
    if (workerBroken) return renderInvoicePdfHere(props);
    throw error;
  }
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

import type { InvoiceDocumentProps } from "./InvoiceDocument";
import { renderInvoicePdfHere } from "./renderCore";

export interface RenderRequest {
  id: number;
  props: InvoiceDocumentProps;
}

export type RenderResponse = { id: number; pdf: Blob } | { id: number; error: string };

// Layout and font subsetting are CPU-heavy; doing them here keeps typing in the editor smooth.
// The worker lives for the whole editor session, so fonts are fetched and parsed only once.
// The project compiles against the DOM lib, so describe just the worker globals used here.
const scope = self as unknown as {
  location: Location;
  onmessage: ((event: MessageEvent<RenderRequest>) => void) | null;
  postMessage: (message: RenderResponse) => void;
};
const fontBaseUrl = `${scope.location.origin}/fonts/invoice`;

scope.onmessage = async ({ data }: MessageEvent<RenderRequest>) => {
  let response: RenderResponse;
  try {
    response = { id: data.id, pdf: await renderInvoicePdfHere(data.props, fontBaseUrl) };
  } catch (error) {
    response = { id: data.id, error: error instanceof Error ? error.message : String(error) };
  }
  scope.postMessage(response);
};

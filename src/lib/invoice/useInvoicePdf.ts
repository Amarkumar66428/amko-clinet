import { useEffect, useState } from "react";
import type { InvoiceDocumentProps } from "./pdf/InvoiceDocument";
import { renderInvoicePdf } from "./pdf/render";

const RENDER_DELAY_MS = 300;

interface PdfState {
  pdf: Blob | null;
  error: unknown;
  rendering: boolean;
}

/**
 * Re-renders the invoice PDF shortly after the inputs stop changing. Stale renders are discarded,
 * so the result always matches the latest inputs. `props` must be referentially stable (memoised).
 */
export function useInvoicePdf(props: InvoiceDocumentProps): PdfState {
  const [state, setState] = useState<PdfState>({ pdf: null, error: null, rendering: true });

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setState((prev) => ({ ...prev, rendering: true }));
      renderInvoicePdf(props).then(
        (pdf) => !cancelled && setState({ pdf, error: null, rendering: false }),
        (error: unknown) => !cancelled && setState((prev) => ({ ...prev, error, rendering: false })),
      );
    }, RENDER_DELAY_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [props]);

  return state;
}

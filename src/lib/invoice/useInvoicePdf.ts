import { useCallback, useEffect, useRef, useState } from "react";
import type { InvoiceDocumentProps } from "./pdf/InvoiceDocument";
import { renderInvoicePdf } from "./pdf/render";

const RENDER_DELAY_MS = 250;

interface PdfState {
  pdf: Blob | null;
  /** The inputs `pdf` was rendered from; equal to the current props when the preview is up to date. */
  source: InvoiceDocumentProps | null;
  error: unknown;
  rendering: boolean;
}

/**
 * Re-renders the invoice PDF shortly after the inputs stop changing. Only one render runs at a time:
 * changes made meanwhile are picked up as soon as it finishes, so renders never pile up, and every
 * finished render is shown even while typing continues. `props` must be referentially stable (memoised).
 */
export function useInvoicePdf(props: InvoiceDocumentProps): PdfState {
  const [state, setState] = useState<PdfState>({ pdf: null, source: null, error: null, rendering: true });
  const latest = useRef(props);
  const running = useRef(false);
  const hasRendered = useRef(false);
  const mounted = useRef(true);

  const renderLatest = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      let target: InvoiceDocumentProps;
      do {
        target = latest.current;
        setState((prev) => (prev.rendering ? prev : { ...prev, rendering: true }));
        try {
          const pdf = await renderInvoicePdf(target);
          if (!mounted.current) return;
          hasRendered.current = true;
          setState({ pdf, source: target, error: null, rendering: target !== latest.current });
        } catch (error) {
          if (!mounted.current) return;
          // A failed intermediate render doesn't matter if a newer one is about to replace it.
          if (target === latest.current) setState((prev) => ({ ...prev, error, rendering: false }));
        }
      } while (target !== latest.current);
    } finally {
      running.current = false;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    latest.current = props;
    // A render in progress picks up the new props when it finishes.
    if (running.current) return;
    const timer = window.setTimeout(() => void renderLatest(), hasRendered.current ? RENDER_DELAY_MS : 0);
    return () => window.clearTimeout(timer);
  }, [props, renderLatest]);

  return state;
}

"use client";

import { useEffect, useRef, useState } from "react";

type PdfJs = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfJs> | null = null;

/** Wait for resizing (e.g. the side panel opening) to settle before re-rasterising every page. */
const RESIZE_SETTLE_MS = 150;

/** Loads pdf.js once and points it at a single shared module worker. */
function loadPdfJs(): Promise<PdfJs> {
  pdfjsPromise ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerPort ??= new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" },
    );
    return pdfjs;
  });
  return pdfjsPromise;
}

interface PdfPreviewProps {
  /** The exact PDF that will be downloaded. */
  pdf: Blob | null;
  onError?: (error: unknown) => void;
}

/**
 * Rasterises every page of a PDF to canvases sized to the container. Unlike an <iframe>, this works
 * on mobile browsers (which don't render PDFs inline) and shows the real file, not an approximation.
 * New renders are swapped in only once complete, so editing never flashes an empty preview.
 */
export default function PdfPreview({ pdf, onError }: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const onErrorRef = useRef(onError);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    let timer: number | undefined;
    let measured = false;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.floor(entry.contentRect.width);
      window.clearTimeout(timer);
      // The first measurement applies at once; later ones wait until resizing stops.
      if (!measured) {
        measured = true;
        setWidth(next);
      } else {
        timer = window.setTimeout(() => setWidth(next), RESIZE_SETTLE_MS);
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!pdf || !width) return;
    let cancelled = false;
    let destroy: (() => Promise<void>) | undefined;
    let cancelPage: (() => void) | undefined;

    (async () => {
      const pdfjs = await loadPdfJs();
      const task = pdfjs.getDocument({ data: new Uint8Array(await pdf.arrayBuffer()) });
      destroy = () => task.destroy();
      const doc = await task.promise;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const canvases: HTMLCanvasElement[] = [];

      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
        if (cancelled) return;
        const page = await doc.getPage(pageNumber);
        const cssScale = width / page.getViewport({ scale: 1 }).width;
        const viewport = page.getViewport({ scale: cssScale * pixelRatio });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${Math.floor(viewport.height / pixelRatio)}px`;
        canvas.className = "block bg-white shadow-[0_12px_32px_rgba(15,23,42,0.14)]";
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", `Invoice preview, page ${pageNumber} of ${doc.numPages}`);

        const renderTask = page.render({ canvas, viewport });
        cancelPage = () => renderTask.cancel();
        await renderTask.promise;
        canvases.push(canvas);
      }

      if (!cancelled) pagesRef.current?.replaceChildren(...canvases);
    })()
      .catch((error: unknown) => {
        // Cancelling a superseded render rejects it; that isn't a failure.
        if (!cancelled) onErrorRef.current?.(error);
      })
      .finally(() => void destroy?.());

    return () => {
      cancelled = true;
      cancelPage?.();
    };
  }, [pdf, width]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Children are managed imperatively (see effect) so a finished render replaces the old one atomically. */}
      <div ref={pagesRef} className="flex flex-col gap-5" />
    </div>
  );
}

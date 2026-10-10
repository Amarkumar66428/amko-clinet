"use client";

import { useEffect, useMemo, useState, type FocusEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import CropLandscapeOutlined from "@mui/icons-material/CropLandscapeOutlined";
import CropPortraitOutlined from "@mui/icons-material/CropPortraitOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import {
  useInvoiceDraft,
  type Draft,
  type SaveStatus,
} from "@/lib/invoice/draft";
import { formatMoney, toPdfFilename } from "@/lib/invoice/format";
import { downloadBlob, renderInvoicePdf } from "@/lib/invoice/pdf/render";
import { calculateTotals } from "@/lib/invoice/state";
import { INVOICE_TEMPLATES, getInvoiceTemplate } from "@/lib/invoice/templates";
import type { TemplateId } from "@/lib/invoice/types";
import { useInvoicePdf } from "@/lib/invoice/useInvoicePdf";
import { notify } from "@/lib/notify";
import AppearanceSection from "./AppearanceSection";
import InvoiceToolbar, { TOOLS, type ToolId } from "./InvoiceToolbar";
import {
  DetailsSection,
  ItemsSection,
  PartySection,
  TaxNotesSection,
} from "./InvoiceSections";
import PdfPreview from "./PdfPreview";
import { ArrowBackIos, CropRotate } from "@mui/icons-material";

const SAVE_LABEL: Record<SaveStatus, string> = {
  idle: "",
  unsaved: "Unsaved changes",
  saving: "Saving…",
  saved: "Draft saved in this browser",
  error: "Couldn't save draft (storage full or disabled)",
};

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

const DESKTOP_QUERY = "(min-width: 1024px)";

/** Preview width in CSS px for an A4 page at 96 dpi. */
const PAGE_WIDTH = { portrait: 794, landscape: 1123 } as const;

/**
 * Height of the on-screen keyboard where the browser overlays it instead of resizing the layout
 * (iOS Safari), so the bottom sheet can sit above it.
 */
function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () =>
      setInset(
        Math.max(
          0,
          Math.round(window.innerHeight - viewport.height - viewport.offsetTop),
        ),
      );
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);
  return inset;
}

/** Phones: keep the focused field visible once the keyboard has finished opening. */
function revealFocusedField(e: FocusEvent<HTMLElement>) {
  const target = e.target;
  if (
    !target.matches("input, select, textarea") ||
    window.matchMedia(DESKTOP_QUERY).matches
  )
    return;
  window.setTimeout(
    () => target.scrollIntoView({ block: "center", behavior: "smooth" }),
    300,
  );
}

interface InvoiceWorkspaceProps {
  templateId: TemplateId;
  /** Draft restored from the browser, or null to start fresh. */
  initialDraft: Draft | null;
}

export default function InvoiceWorkspace({
  templateId,
  initialDraft,
}: InvoiceWorkspaceProps) {
  const router = useRouter();
  // The page only renders for known ids (generateStaticParams + dynamicParams = false).
  const template = getInvoiceTemplate(templateId)!;
  const {
    invoice,
    dispatch,
    appearance,
    setAppearance,
    resetAppearance,
    resetInvoice,
    orientation,
    setOrientation,
    saveStatus,
    savedAt,
    saveNow,
  } = useInvoiceDraft(template, initialDraft);
  const keyboardInset = useKeyboardInset();
  const isLandscape = orientation === "landscape";

  // Desktop opens on the first tool; on phones the panel is a sheet over the preview, so start closed.
  const [activeTool, setActiveTool] = useState<ToolId | null>(() =>
    window.matchMedia(DESKTOP_QUERY).matches ? "details" : null,
  );
  const [downloading, setDownloading] = useState(false);
  // Remember which PDF failed to rasterise, so the error clears as soon as a newer PDF arrives.
  const [failedPreview, setFailedPreview] = useState<Blob | null>(null);

  const pdfProps = useMemo(
    () => ({ templateId, invoice, appearance, orientation }),
    [templateId, invoice, appearance, orientation],
  );
  const {
    pdf,
    source: pdfSource,
    error: renderError,
    rendering,
  } = useInvoicePdf(pdfProps);
  const total = useMemo(
    () => formatMoney(calculateTotals(invoice).total, invoice.currency),
    [invoice],
  );
  const failed =
    Boolean(renderError) || (pdf !== null && failedPreview === pdf);

  const toolIndex = TOOLS.findIndex((tool) => tool.id === activeTool);
  const tool = TOOLS[toolIndex];
  const nextTool = TOOLS[toolIndex + 1];

  useEffect(() => {
    if (!activeTool) return;
    const onKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" && setActiveTool(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTool]);

  const toggleTool = (id: ToolId) =>
    setActiveTool((current) => (current === id ? null : id));

  async function handleDownload() {
    setDownloading(true);
    try {
      // Reuse the preview when it already matches the current state; otherwise render the latest
      // keystrokes so the file is never behind the editor.
      const file =
        pdf && pdfSource === pdfProps ? pdf : await renderInvoicePdf(pdfProps);
      downloadBlob(file, toPdfFilename(invoice.invoiceNumber));
    } catch (error) {
      console.error("PDF generation failed:", error);
      notify("Couldn't generate the PDF. Please try again.", "error");
    } finally {
      setDownloading(false);
    }
  }

  async function handleSaveDraft() {
    if (await saveNow())
      notify("Draft saved. It will be here when you come back.", "success");
    else
      notify(
        "Couldn't save the draft. Browser storage may be full or disabled.",
        "error",
      );
  }

  function handleNewInvoice() {
    if (
      window.confirm(
        "Start a new invoice? Your current details will be cleared.",
      )
    )
      resetInvoice();
  }

  function renderTool(id: ToolId) {
    switch (id) {
      case "details":
        return <DetailsSection invoice={invoice} dispatch={dispatch} />;
      case "sender":
      case "client":
        return (
          <PartySection party={id} invoice={invoice} dispatch={dispatch} />
        );
      case "items":
        return <ItemsSection invoice={invoice} dispatch={dispatch} />;
      case "tax":
        return <TaxNotesSection invoice={invoice} dispatch={dispatch} />;
      case "appearance":
        return (
          <AppearanceSection
            appearance={appearance}
            defaults={template.defaultAppearance}
            onChange={setAppearance}
            onReset={resetAppearance}
          />
        );
    }
  }

  return (
    <main className="flex h-dvh flex-col bg-canvas text-ink">
      <header className="z-30 shrink-0 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between gap-3 px-3 md:px-[clamp(16px,3vw,36px)]">
          <div className="flex min-w-0 items-center gap-2 md:gap-3.5">
            <Link
              href="/invoice/templates"
              className="inline-flex h-[38px] shrink-0 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowBackIos className="h-3 w-3" />{" "}
              <span className="ml-1 hidden sm:inline">Templates</span>
            </Link>
            <label className="sr-only" htmlFor="template-switcher">
              Template
            </label>
            <select
              id="template-switcher"
              className="h-[38px] min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-semibold text-ink outline-none focus:border-blue-600"
              value={templateId}
              onChange={(e) =>
                router.replace(`/invoice/editor/${e.target.value}`)
              }
            >
              {INVOICE_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <p
              className={`hidden text-[11px] xl:block ${saveStatus === "error" ? "text-red-600" : "text-slate-500"}`}
              aria-live="polite"
            >
              {saveStatus === "saved" && savedAt
                ? `Draft saved at ${timeFormat.format(savedAt)}`
                : SAVE_LABEL[saveStatus]}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={
                isLandscape ? "Switch to portrait" : "Switch to landscape"
              }
              title={isLandscape ? "Switch to portrait" : "Switch to landscape"}
              className="inline-flex h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50"
              onClick={() =>
                setOrientation(isLandscape ? "portrait" : "landscape")
              }
            >
              <CropRotate fontSize="small" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Save draft"
              title={SAVE_LABEL[saveStatus] || "Save draft in this browser"}
              className={`inline-flex h-[38px] items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition disabled:cursor-wait ${
                saveStatus === "error"
                  ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border-slate-200 bg-white text-ink hover:border-slate-300 hover:bg-slate-50"
              }`}
              disabled={saveStatus === "saving"}
              onClick={handleSaveDraft}
            >
              {saveStatus === "saved" ? (
                <CheckOutlined
                  fontSize="small"
                  className="text-emerald-600"
                  aria-hidden
                />
              ) : (
                <SaveOutlined fontSize="small" aria-hidden />
              )}
              <span className="hidden md:inline">
                {saveStatus === "saving"
                  ? "Saving…"
                  : saveStatus === "saved"
                    ? "Saved"
                    : "Save draft"}
              </span>
            </button>
            <button
              type="button"
              className="hidden h-[38px] rounded-lg px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-ink sm:block"
              onClick={handleNewInvoice}
            >
              New invoice
            </button>
            <button
              type="button"
              className="h-[38px] whitespace-nowrap rounded-xl bg-blue-600 px-[13px] text-[13px] font-bold text-white shadow-[0_5px_15px_rgba(37,99,235,0.18)] transition enabled:hover:bg-blue-700 enabled:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none md:h-[42px] md:px-[18px]"
              disabled={downloading}
              onClick={handleDownload}
            >
              {downloading ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-3 py-1.5 md:px-[clamp(16px,3vw,36px)]">
          <InvoiceToolbar
            active={activeTool}
            itemCount={invoice.items.length}
            onSelect={toggleTool}
          />
          <strong className="hidden text-sm text-ink sm:block">{total}</strong>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {tool && (
          <>
            {/* Phones: tap outside the sheet to dismiss it. */}
            <button
              type="button"
              aria-label="Close panel"
              tabIndex={-1}
              className="absolute inset-0 z-10 bg-ink/30 lg:hidden"
              onClick={() => setActiveTool(null)}
            />
            <aside
              aria-labelledby="tool-panel-title"
              // Phones: lift the sheet above an overlaid keyboard and let it use the freed height.
              style={
                keyboardInset
                  ? {
                      bottom: keyboardInset,
                      maxHeight: `calc(100% - ${keyboardInset}px)`,
                    }
                  : undefined
              }
              className="absolute inset-x-0 bottom-0 z-20 flex max-h-[88%] flex-col rounded-t-2xl bg-white shadow-[0_-12px_40px_rgba(15,23,42,0.18)] lg:static! lg:max-h-none! lg:w-[420px] lg:shrink-0 lg:rounded-none lg:border-r lg:border-slate-200 lg:shadow-none xl:w-[460px]"
            >
              <div
                aria-hidden
                className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-slate-200 lg:hidden"
              />
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-3.5">
                <h2
                  id="tool-panel-title"
                  className="flex items-center gap-2.5 text-sm font-bold text-ink"
                >
                  <tool.Icon
                    fontSize="small"
                    className="text-blue-600"
                    aria-hidden
                  />
                  {tool.label}
                </h2>
                <button
                  type="button"
                  aria-label="Close panel"
                  className="grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-ink"
                  onClick={() => setActiveTool(null)}
                >
                  <CloseOutlined fontSize="small" aria-hidden />
                </button>
              </div>

              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-py-6 px-4 py-4 sm:px-5"
                onFocus={revealFocusedField}
              >
                {renderTool(tool.id)}
                {tool.id === "details" && (
                  <button
                    type="button"
                    className="mt-2 w-full py-2 text-xs font-semibold text-slate-500 hover:text-ink sm:hidden"
                    onClick={handleNewInvoice}
                  >
                    Start a new invoice
                  </button>
                )}
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
                <span className="text-[11px] text-slate-400">
                  {toolIndex + 1} / {TOOLS.length}
                </span>
                {nextTool ? (
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-ink transition hover:bg-slate-200"
                    onClick={() => setActiveTool(nextTool.id)}
                  >
                    Next: {nextTool.label} →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    disabled={downloading}
                    onClick={handleDownload}
                  >
                    Done — Download PDF
                  </button>
                )}
              </div>
            </aside>
          </>
        )}

        <section
          aria-label="PDF preview"
          className="flex min-w-0 flex-1 flex-col items-center overflow-y-auto bg-[#e9edf4] px-3 py-5 md:p-6 xl:px-[clamp(24px,4vw,52px)]"
        >
          <div
            className="mb-3.5 flex w-full items-center justify-between"
            style={{ maxWidth: PAGE_WIDTH[orientation] }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink">Live preview</span>
              <small className="rounded-full bg-white/65 px-[7px] py-[3px] text-[10px] text-slate-500">
                A4 · {isLandscape ? "Landscape" : "Portrait"}
              </small>
              {rendering && pdf && (
                <small className="text-[10px] text-slate-500">Updating…</small>
              )}
            </div>
            <strong className="text-[13px] text-ink sm:hidden">{total}</strong>
          </div>

          <div className="w-full" style={{ maxWidth: PAGE_WIDTH[orientation] }}>
            {failed ? (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-white p-6 text-center text-sm text-red-700"
              >
                The preview couldn&apos;t be rendered. Try changing the last
                edit, or reload the page.
              </div>
            ) : !pdf ? (
              <div
                className={`grid w-full animate-pulse place-items-center rounded bg-white/70 text-xs text-slate-400 ${
                  isLandscape ? "aspect-[297/210]" : "aspect-[210/297]"
                }`}
              >
                Rendering preview…
              </div>
            ) : null}
            {!failed && (
              <PdfPreview
                pdf={pdf}
                onError={(error) => {
                  console.error("Preview failed:", error);
                  setFailedPreview(pdf);
                }}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

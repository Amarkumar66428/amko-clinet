"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toolsService from "@/lib/toolsService";
import useInvoice from "@/lib/useInvoice";
import { generateAndDownloadPdf } from "@/lib/downloadInvoicePdf";
import InvoiceEditor from "@/components/InvoiceEditor";
import InvoicePreview from "@/components/InvoicePreview";
import AppearanceEditor from "@/components/AppearanceEditor";
import "@/styles/invoice.scss";

export default function InvoiceEditorPage() {
  const { templateId } = useParams();
  const router = useRouter();
  const { invoice, totals, dispatch } = useInvoice();
  const [template, setTemplate] = useState(null);
  const [appearance, setAppearance] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let mounted = true;
    toolsService
      .getInvoiceTemplate(templateId)
      .then(({ data }) => {
        if (!mounted) return;
        setTemplate(data.template);
        setAppearance({ ...data.template.defaultAppearance });
      })
      .catch((error) => {
        console.error("Template error:", error);
        router.replace("/invoice/templates");
      });
    return () => {
      mounted = false;
    };
  }, [templateId, router]);

  async function downloadPdf() {
    try {
      setExporting(true);
      await generateAndDownloadPdf({
        invoice,
        templateId: template.id,
        appearance,
        filename: `${invoice.invoiceNumber || "invoice"}.pdf`,
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Unable to generate PDF.");
    } finally {
      setExporting(false);
    }
  }

  if (!template || !appearance) {
    return <div className="editor-loading">Loading invoice...</div>;
  }

  return (
    <main className="invoice-builder">
      <header className="invoice-toolbar">
        <div>
          <button type="button" className="back-btn" onClick={() => router.push("/invoice/templates")}>
            ← Templates
          </button>
          <div>
            <strong>{template.name}</strong>
            <small>{template.category}</small>
          </div>
        </div>

        <button type="button" className="download-btn" disabled={exporting} onClick={downloadPdf}>
          {exporting ? "Creating PDF..." : "Download PDF"}
        </button>
      </header>

      <div className="invoice-builder-layout">
        <aside className="invoice-controls">
          <InvoiceEditor invoice={invoice} dispatch={dispatch} />
          <AppearanceEditor appearance={appearance} setAppearance={setAppearance} />
        </aside>

        <section className="preview-column">
          <div className="preview-heading">
            <div>
              <span>Live Preview</span>
              <small>A4</small>
            </div>
            <strong>
              {invoice.currency} {totals.total.toFixed(2)}
            </strong>
          </div>
          <InvoicePreview invoice={invoice} template={template} appearance={appearance} />
        </section>
      </div>
    </main>
  );
}

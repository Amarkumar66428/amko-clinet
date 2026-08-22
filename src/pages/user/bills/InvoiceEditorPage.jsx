import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import toolsService from "../../../services/toolsService";

import useInvoice from "../../../hooks/useInvoice";

import InvoiceEditor from "../../../components/InvoiceEditor";

import InvoicePreview from "../../../components/InvoicePreview";

import AppearanceEditor from "../../../components/AppearanceEditor";

import { generateAndDownloadPdf } from "../../../features/downloadInvoicePdf";

import "./invoice.scss";

export default function InvoiceEditorPage() {
  const { templateId } = useParams();

  const navigate = useNavigate();

  const { invoice, totals, dispatch } = useInvoice();

  const [template, setTemplate] = useState(null);

  const [appearance, setAppearance] = useState(null);

  const [loading, setLoading] = useState(true);

  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadTemplate() {
      try {
        const response = await toolsService.getInvoiceTemplate(templateId);

        if (!mounted) {
          return;
        }

        const selectedTemplate = response.data.template;

        setTemplate(selectedTemplate);

        setAppearance({
          ...selectedTemplate.defaultAppearance,
        });
      } catch (error) {
        console.error("Template error:", error);

        navigate("/invoice/templates", {
          replace: true,
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTemplate();

    return () => {
      mounted = false;
    };
  }, [templateId, navigate]);

  async function downloadPdf() {
    if (!template || !appearance) {
      return;
    }

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

  if (loading || !template || !appearance) {
    return <div className="editor-loading">Loading invoice...</div>;
  }

  return (
    <main className="invoice-builder">
      <header className="invoice-toolbar">
        <div>
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/invoice/templates")}
          >
            ← Templates
          </button>

          <div>
            <strong>{template.name}</strong>

            <small>{template.category}</small>
          </div>
        </div>

        <button
          type="button"
          className="download-btn"
          disabled={exporting}
          onClick={downloadPdf}
        >
          {exporting ? "Creating PDF..." : "Download PDF"}
        </button>
      </header>

      <div className="invoice-builder-layout">
        <aside className="invoice-controls">
          <InvoiceEditor invoice={invoice} dispatch={dispatch} />

          <AppearanceEditor
            appearance={appearance}
            setAppearance={setAppearance}
          />
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

          <InvoicePreview
            invoice={invoice}
            template={template}
            appearance={appearance}
          />
        </section>
      </div>
    </main>
  );
}

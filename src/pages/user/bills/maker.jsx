import React, { useMemo, useRef, useState } from "react";
import './maker.scss';
import { generateAndDownloadPdf } from "../../../features/downloadPdf";

const initialInvoice = {
  invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  currency: "INR",
  sender: {
    name: "Acme Web Studios",
    email: "hello@acmestudio.io",
    address: "100 Innovation Way, Suite 4B",
  },
  client: {
    name: "Nexus Corp",
    email: "billing@nexuscorp.com",
    address: "742 Evergreen Terrace",
  },
  items: [
    { description: "UI/UX Interface Design", quantity: 1, rate: 850 },
    { description: "Frontend Development (React)", quantity: 20, rate: 45 },
  ],
  taxRate: 10,
  discount: 50,
  notes: "Payment is due within 14 days of invoice issue date.",
};

const money = (currency, value) =>
  `${currency} ${Number(value || 0).toFixed(2)}`;

function InvoiceDocument({ invoice, template, invoiceRef }) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0),
    0
  );
  const taxAmount = subtotal * (Number(invoice.taxRate) || 0) / 100;
  const total = Math.max(0, subtotal + taxAmount - Number(invoice.discount || 0));

  return (
    <div ref={invoiceRef} className={`invoice invoice--${template}`}>
      {template === "modern" && (
        <>
          <header className="invoice__header">
            <div>
              <div className="invoice__eyebrow">Invoice</div>
              <div className="invoice__number">#{invoice.invoiceNumber}</div>
            </div>
            <div className="invoice__dates">
              <div><span>Date</span>{invoice.invoiceDate}</div>
              {invoice.dueDate && <div><span>Due</span>{invoice.dueDate}</div>}
            </div>
          </header>
          <div className="invoice__parties">
            <Party label="From" data={invoice.sender} />
            <Party label="Billed To" data={invoice.client} />
          </div>
          <ItemsTable invoice={invoice} />
          <Totals invoice={invoice} subtotal={subtotal} taxAmount={taxAmount} total={total} />
          <Notes notes={invoice.notes} />
        </>
      )}

      {template === "corporate" && (
        <>
          <header className="corporate__header">
            <div>
              <strong>{invoice.sender.name || "ENTERPRISE CO."}</strong>
              <small>{invoice.sender.email}</small>
            </div>
            <div className="corporate__title">
              <b>INVOICE</b>
              <small>#{invoice.invoiceNumber}</small>
            </div>
          </header>
          <div className="corporate__meta">
            <Party label="ISSUED TO" data={invoice.client} />
            <div className="corporate__dates">
              <div>Invoice Date: <b>{invoice.invoiceDate}</b></div>
              {invoice.dueDate && <div>Payment Due: <b>{invoice.dueDate}</b></div>}
            </div>
          </div>
          <ItemsTable invoice={invoice} />
          <Totals invoice={invoice} subtotal={subtotal} taxAmount={taxAmount} total={total} boxed />
          <Notes notes={invoice.notes} terms />
        </>
      )}

      {template === "dark" && (
        <>
          <header className="dark__header">
            <div>
              <strong>{invoice.sender.name || "CREATIVE STUDIO"}</strong>
              <small>{invoice.sender.email}</small>
            </div>
            <span>#{invoice.invoiceNumber}</span>
          </header>
          <div className="dark__meta">
            <Party label="CLIENT" data={invoice.client} />
            <div className="dark__dates">
              <div>Issued: {invoice.invoiceDate}</div>
              <div>Due: {invoice.dueDate || "On Receipt"}</div>
            </div>
          </div>
          <ItemsTable invoice={invoice} dark />
          <Totals invoice={invoice} subtotal={subtotal} taxAmount={taxAmount} total={total} dark />
          <Notes notes={invoice.notes} dark />
        </>
      )}
    </div>
  );
}

function Party({ label, data }) {
  return (
    <section className="party">
      <span className="party__label">{label}</span>
      <strong>{data.name || "Business / Client Name"}</strong>
      <p>{data.address}</p>
      <small>{data.email}</small>
    </section>
  );
}

function ItemsTable({ invoice, dark = false }) {
  return (
    <table className={`invoice-table ${dark ? "invoice-table--dark" : ""}`}>
      <thead>
        <tr>
          <th>Description</th>
          <th className="num">Qty</th>
          <th className="num">Rate</th>
          <th className="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoice.items.map((item, index) => (
          <tr key={index}>
            <td>{item.description || "Untitled Item"}</td>
            <td className="num">{item.quantity}</td>
            <td className="num">{money(invoice.currency, item.rate)}</td>
            <td className="num strong">
              {money(invoice.currency, Number(item.quantity || 0) * Number(item.rate || 0))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Totals({ invoice, subtotal, taxAmount, total, boxed = false, dark = false }) {
  return (
    <div className={`totals ${boxed ? "totals--boxed" : ""} ${dark ? "totals--dark" : ""}`}>
      <div><span>Subtotal</span><b>{money(invoice.currency, subtotal)}</b></div>
      {Number(invoice.taxRate) > 0 && (
        <div><span>Tax ({invoice.taxRate}%)</span><b>{money(invoice.currency, taxAmount)}</b></div>
      )}
      {Number(invoice.discount) > 0 && (
        <div><span>Discount</span><b className="discount">-{money(invoice.currency, invoice.discount)}</b></div>
      )}
      <div className="totals__grand"><span>Amount Due</span><strong>{money(invoice.currency, total)}</strong></div>
    </div>
  );
}

function Notes({ notes, terms = false, dark = false }) {
  if (!notes) return null;
  return (
    <div className={`invoice-notes ${terms ? "invoice-notes--terms" : ""} ${dark ? "invoice-notes--dark" : ""}`}>
      {terms ? <><b>Terms</b> {notes}</> : <><b>Notes</b><p>{notes}</p></>}
    </div>
  );
}

export default function SideBySideBillMaker() {
  const [template, setTemplate] = useState("modern");
  const [invoice, setInvoice] = useState(initialInvoice);
  const [exporting, setExporting] = useState(false);
  const invoiceRef = useRef(null);

  const totals = useMemo(() => {
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0),
      0
    );
    const taxAmount = subtotal * (Number(invoice.taxRate) || 0) / 100;
    return {
      subtotal,
      taxAmount,
      total: Math.max(0, subtotal + taxAmount - Number(invoice.discount || 0)),
    };
  }, [invoice]);

  const update = (path, value) => {
    setInvoice(prev => {
      const next = structuredClone(prev);
      let target = next;
      path.slice(0, -1).forEach(key => { target = target[key]; });
      target[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateItem = (index, field, value) => {
    setInvoice(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () =>
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0 }],
    }));

  const removeItem = index =>
    setInvoice(prev => ({
      ...prev,
      items: prev.items.length === 1 ? prev.items : prev.items.filter((_, i) => i !== index),
    }));

  const downloadPdf = async () => {
    if (!invoiceRef.current) return;
    setExporting(true);
    try {
      const elementHtml = invoiceRef.current.innerHTML;

      // Extract all currently loaded stylesheets to guarantee CSS match
      const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((node) => node.outerHTML)
        .join('\n');

      // Wrap in a full standalone HTML document
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            ${styleTags}
            <style>
              /* Force print background colors and typography */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body {
                background-color: #ffffff;
                margin: 0;
                padding: 0;
                font-family: system-ui, -apple-system, sans-serif;
              }
            </style>
          </head>
          <body>
            ${elementHtml}
          </body>
        </html>
      `;

      await generateAndDownloadPdf({
        htmlContent: fullHtml,
        filename: `invoice_${Date.now()}.pdf`,
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Unable to create the PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };


  return (
    <main className="bill-maker">
      <header className="bill-toolbar">
        <div className="toolbar-brand">
          <span className="brand-mark">B</span>
          <div>
            <strong>Bill Generator</strong>
            <small>Create professional invoices</small>
          </div>
        </div>

        <div className="template-switcher" role="tablist">
          {[
            ["modern", "Modern"],
            ["corporate", "Corporate"],
            ["dark", "Dark"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={template === value ? "active" : ""}
              onClick={() => setTemplate(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="download-btn" type="button" onClick={downloadPdf} disabled={exporting}>
          {exporting ? "Creating PDF..." : "↓ Download PDF"}
        </button>
      </header>

      <div className="bill-layout">
        <aside className="editor-panel">
          <section className="form-card">
            <div className="card-heading">
              <div><span>01</span><h3>Invoice details</h3></div>
            </div>
            <div className="form-grid form-grid--2">
              <Field label="Invoice #" value={invoice.invoiceNumber} onChange={e => update(["invoiceNumber"], e.target.value)} />
              <SelectField label="Currency" value={invoice.currency} onChange={e => update(["currency"], e.target.value)}>
                <option>INR</option><option>USD</option><option>EUR</option><option>GBP</option>
              </SelectField>
              <Field type="date" label="Invoice date" value={invoice.invoiceDate} onChange={e => update(["invoiceDate"], e.target.value)} />
              <Field type="date" label="Due date" value={invoice.dueDate} onChange={e => update(["dueDate"], e.target.value)} />
            </div>
          </section>

          <section className="form-grid form-grid--2">
            <PartyEditor title="Your information" data={invoice.sender} update={update} path="sender" />
            <PartyEditor title="Client information" data={invoice.client} update={update} path="client" />
          </section>

          <section className="form-card">
            <div className="card-heading">
              <div><span>03</span><h3>Line items</h3></div>
              <button className="text-btn" type="button" onClick={addItem}>+ Add item</button>
            </div>

            <div className="items-editor">
              {invoice.items.map((item, index) => (
                <div className="item-editor" key={index}>
                  <Field label="Description" value={item.description} onChange={e => updateItem(index, "description", e.target.value)} />
                  <Field label="Qty" type="number" min="0" value={item.quantity} onChange={e => updateItem(index, "quantity", e.target.value)} />
                  <Field label="Rate" type="number" min="0" value={item.rate} onChange={e => updateItem(index, "rate", e.target.value)} />
                  <button className="remove-btn" type="button" onClick={() => removeItem(index)} aria-label="Remove item">×</button>
                </div>
              ))}
            </div>
          </section>

          <section className="form-card">
            <div className="card-heading"><div><span>04</span><h3>Adjustments</h3></div></div>
            <div className="form-grid form-grid--2">
              <Field label="Tax rate (%)" type="number" min="0" value={invoice.taxRate} onChange={e => update(["taxRate"], e.target.value)} />
              <Field label={`Discount (${invoice.currency})`} type="number" min="0" value={invoice.discount} onChange={e => update(["discount"], e.target.value)} />
            </div>
            <label className="field field--full">
              <span>Notes / terms</span>
              <textarea rows="3" value={invoice.notes} onChange={e => update(["notes"], e.target.value)} />
            </label>
          </section>
        </aside>

        <section className="preview-panel">
          <div className="preview-topline">
            <span>Live preview</span>
            <span>A4 · {invoice.currency} · {template}</span>
          </div>
          <div className="paper-wrap">
            <InvoiceDocument invoice={invoice} template={template} invoiceRef={invoiceRef} />
          </div>
          <div className="preview-summary">
            <span>Amount due</span>
            <strong>{money(invoice.currency, totals.total)}</strong>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, type = "text", value, onChange, min }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} min={min} value={value ?? ""} onChange={onChange} />
    </label>
  );
}

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={onChange}>{children}</select>
    </label>
  );
}

function PartyEditor({ title, data, update, path }) {
  return (
    <section className="form-card">
      <div className="card-heading"><div><span>{path === "sender" ? "02A" : "02B"}</span><h3>{title}</h3></div></div>
      <Field label="Name" value={data.name} onChange={e => update([path, "name"], e.target.value)} />
      <Field label="Email" value={data.email} onChange={e => update([path, "email"], e.target.value)} />
      <label className="field field--full">
        <span>Address</span>
        <textarea rows="2" value={data.address} onChange={e => update([path, "address"], e.target.value)} />
      </label>
    </section>
  );
}
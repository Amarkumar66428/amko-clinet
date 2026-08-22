export const invoiceTemplates = [
  {
    id: "modern-blue",
    name: "Modern Blue",
    category: "Modern",
    isFree: true,
    description: "Clean, spacious and ideal for freelancers or agencies.",
    previewAccent: "#2563eb",
    defaultAppearance: { accentColor: "#2563eb", textColor: "#172033" },
    html: `
      <main class="invoice-page modern-template">
        <header class="modern-header">
          <div>
            <div class="eyebrow">INVOICE</div>
            <h1>#{{invoiceNumber}}</h1>
          </div>
          <div class="date-stack">
            <div><span>Invoice date</span><strong>{{invoiceDate}}</strong></div>
            {{#if dueDate}}<div><span>Due date</span><strong>{{dueDate}}</strong></div>{{/if}}
          </div>
        </header>

        <section class="party-grid">
          <article>
            <span class="section-label">FROM</span>
            <h2>{{sender.name}}</h2>
            <p>{{sender.address}}</p>
            <p>{{sender.email}}</p>
          </article>
          <article>
            <span class="section-label">BILLED TO</span>
            <h2>{{client.name}}</h2>
            <p>{{client.address}}</p>
            <p>{{client.email}}</p>
          </article>
        </section>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="numeric">Qty</th>
              <th class="numeric">Rate</th>
              <th class="numeric">Amount</th>
            </tr>
          </thead>
          <tbody>
            {{#each items}}
              <tr>
                <td>{{description}}</td>
                <td class="numeric">{{quantity}}</td>
                <td class="numeric">{{rateFormatted}}</td>
                <td class="numeric strong">{{amountFormatted}}</td>
              </tr>
            {{/each}}
          </tbody>
        </table>

        <section class="bottom-grid">
          <div class="notes-block">
            {{#if notes}}<span class="section-label">NOTES</span><p>{{notes}}</p>{{/if}}
          </div>
          <div class="totals-block avoid-break">
            <div><span>Subtotal</span><strong>{{subtotalFormatted}}</strong></div>
            <div><span>Tax ({{taxRate}}%)</span><strong>{{taxAmountFormatted}}</strong></div>
            <div><span>Discount</span><strong>-{{discountFormatted}}</strong></div>
            <div class="grand-total"><span>Amount due</span><strong>{{totalFormatted}}</strong></div>
          </div>
        </section>
      </main>
    `,
    css: `
      .modern-template { padding: 17mm; }
      .modern-header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid var(--invoice-accent); padding-bottom: 22px; }
      .eyebrow, .section-label { color: var(--invoice-accent); font-size: .74em; font-weight: 800; letter-spacing: .14em; }
      .modern-header h1 { margin: 6px 0 0; font-size: 2.4em; line-height: 1; }
      .date-stack { display: grid; gap: 12px; text-align: right; }
      .date-stack div { display: grid; gap: 3px; }
      .date-stack span { opacity: .6; font-size: .8em; }
      .party-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; padding: 28px 0; }
      .party-grid h2 { margin: 7px 0; font-size: 1.05em; }
      .party-grid p { margin: 3px 0; line-height: 1.45; opacity: .76; }
      .items-table { width: 100%; }
      .items-table th { padding: 11px 9px; background: #f4f7fb; color: #526077; text-align: left; font-size: .78em; text-transform: uppercase; letter-spacing: .05em; }
      .items-table td { padding: 13px 9px; border-bottom: 1px solid #e7ebf2; vertical-align: top; }
      .numeric { text-align: right !important; white-space: nowrap; }
      .strong { font-weight: 700; }
      .bottom-grid { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 38px; margin-top: 24px; }
      .notes-block p { margin: 8px 0 0; color: #667085; line-height: 1.55; }
      .totals-block { display: grid; gap: 10px; }
      .totals-block > div { display: flex; justify-content: space-between; gap: 24px; }
      .grand-total { margin-top: 4px; padding-top: 13px; border-top: 2px solid var(--invoice-accent); font-size: 1.08em; }
      .grand-total strong { color: var(--invoice-accent); }
    `,
  },
  {
    id: "executive",
    name: "Executive",
    category: "Corporate",
    isFree: true,
    description: "Formal layout for consulting, B2B and enterprise billing.",
    previewAccent: "#111827",
    defaultAppearance: { accentColor: "#111827", textColor: "#172033" },
    html: `
      <main class="invoice-page executive-template">
        <header class="executive-header">
          <div>
            <div class="company-name">{{sender.name}}</div>
            <div class="muted">{{sender.email}}</div>
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <span>#{{invoiceNumber}}</span>
          </div>
        </header>

        <section class="executive-meta">
          <div>
            <span class="label">ISSUED TO</span>
            <h2>{{client.name}}</h2>
            <p>{{client.address}}</p>
            <p>{{client.email}}</p>
          </div>
          <div class="meta-card">
            <div><span>Invoice date</span><strong>{{invoiceDate}}</strong></div>
            {{#if dueDate}}<div><span>Payment due</span><strong>{{dueDate}}</strong></div>{{/if}}
          </div>
        </section>

        <table class="executive-table">
          <thead><tr><th>Service</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead>
          <tbody>
            {{#each items}}
              <tr><td>{{description}}</td><td>{{quantity}}</td><td>{{rateFormatted}}</td><td><b>{{amountFormatted}}</b></td></tr>
            {{/each}}
          </tbody>
        </table>

        <section class="executive-footer">
          <div class="terms">{{#if notes}}<b>Terms</b><p>{{notes}}</p>{{/if}}</div>
          <div class="executive-totals avoid-break">
            <div><span>Subtotal</span><b>{{subtotalFormatted}}</b></div>
            <div><span>Tax</span><b>{{taxAmountFormatted}}</b></div>
            <div><span>Discount</span><b>-{{discountFormatted}}</b></div>
            <div class="payable"><span>Payable</span><b>{{totalFormatted}}</b></div>
          </div>
        </section>
      </main>
    `,
    css: `
      .executive-template { padding: 16mm 17mm; }
      .executive-header { display: flex; justify-content: space-between; align-items: flex-start; border-top: 8px solid var(--invoice-accent); padding-top: 20px; }
      .company-name { font-weight: 800; font-size: 1.18em; }
      .muted { margin-top: 5px; color: #667085; }
      .invoice-title { text-align: right; }
      .invoice-title h1 { margin: 0; font-size: 2.3em; letter-spacing: .08em; }
      .invoice-title span { display: block; margin-top: 4px; color: #667085; }
      .executive-meta { display: grid; grid-template-columns: 1fr 250px; gap: 52px; margin: 40px 0 30px; }
      .label { font-size: .72em; font-weight: 800; letter-spacing: .14em; color: #667085; }
      .executive-meta h2 { margin: 8px 0 5px; font-size: 1.08em; }
      .executive-meta p { margin: 3px 0; color: #667085; }
      .meta-card { border: 1px solid #dfe3ea; padding: 15px; display: grid; gap: 12px; }
      .meta-card div { display: flex; justify-content: space-between; gap: 16px; }
      .meta-card span { color: #667085; }
      .executive-table { width: 100%; }
      .executive-table th { background: var(--invoice-accent); color: #fff; padding: 12px 10px; text-align: right; font-size: .78em; letter-spacing: .05em; text-transform: uppercase; }
      .executive-table th:first-child, .executive-table td:first-child { text-align: left; }
      .executive-table td { padding: 14px 10px; border-bottom: 1px solid #e4e7ec; text-align: right; }
      .executive-footer { display: grid; grid-template-columns: 1fr 270px; gap: 48px; margin-top: 30px; }
      .terms { color: #667085; line-height: 1.55; }
      .terms b { color: var(--invoice-text); }
      .executive-totals { border: 1px solid #dfe3ea; padding: 16px; display: grid; gap: 10px; }
      .executive-totals > div { display: flex; justify-content: space-between; gap: 22px; }
      .payable { border-top: 1px solid #cfd5df; margin-top: 4px; padding-top: 12px; font-size: 1.08em; }
    `,
  },
  {
    id: "studio-dark",
    name: "Studio Dark",
    category: "Creative",
    isFree: true,
    description: "Premium dark design for studios and creative professionals.",
    previewAccent: "#d4ff52",
    defaultAppearance: { accentColor: "#d4ff52", textColor: "#f7f8fa" },
    html: `
      <main class="invoice-page dark-template">
        <header class="dark-header">
          <div>
            <span class="dark-kicker">INVOICE</span>
            <h1>{{sender.name}}</h1>
          </div>
          <div class="dark-number">#{{invoiceNumber}}</div>
        </header>

        <section class="dark-details">
          <div><span>CLIENT</span><h2>{{client.name}}</h2><p>{{client.address}}</p><p>{{client.email}}</p></div>
          <div><span>ISSUED</span><h2>{{invoiceDate}}</h2>{{#if dueDate}}<p>Due {{dueDate}}</p>{{/if}}</div>
        </section>

        <table class="dark-table">
          <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>
            {{#each items}}
              <tr><td>{{description}}</td><td>{{quantity}}</td><td>{{rateFormatted}}</td><td>{{amountFormatted}}</td></tr>
            {{/each}}
          </tbody>
        </table>

        <section class="dark-bottom">
          <div class="dark-note">{{#if notes}}<span>NOTE</span><p>{{notes}}</p>{{/if}}</div>
          <div class="dark-total avoid-break">
            <div><span>Subtotal</span><b>{{subtotalFormatted}}</b></div>
            <div><span>Tax</span><b>{{taxAmountFormatted}}</b></div>
            <div><span>Discount</span><b>-{{discountFormatted}}</b></div>
            <div class="dark-grand"><span>TOTAL</span><b>{{totalFormatted}}</b></div>
          </div>
        </section>
      </main>
    `,
    css: `
      body { background: #0e1117; }
      .dark-template { padding: 17mm; background: #0e1117; color: var(--invoice-text); }
      .dark-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 32px; border-bottom: 1px solid #2b3340; }
      .dark-kicker, .dark-details span, .dark-note span { color: var(--invoice-accent); font-size: .73em; font-weight: 800; letter-spacing: .16em; }
      .dark-header h1 { margin: 8px 0 0; font-size: 1.35em; }
      .dark-number { font-size: 2.2em; font-weight: 800; color: var(--invoice-accent); }
      .dark-details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 30px 0; }
      .dark-details h2 { margin: 8px 0 6px; font-size: 1.04em; }
      .dark-details p { margin: 3px 0; color: #aab2c0; }
      .dark-table { width: 100%; }
      .dark-table th { padding: 12px 10px; border-bottom: 1px solid #3a4352; color: #8f9bad; text-align: right; text-transform: uppercase; font-size: .76em; }
      .dark-table th:first-child, .dark-table td:first-child { text-align: left; }
      .dark-table td { padding: 15px 10px; border-bottom: 1px solid #252c37; text-align: right; }
      .dark-bottom { display: grid; grid-template-columns: 1fr 290px; gap: 44px; margin-top: 30px; }
      .dark-note p { color: #aab2c0; line-height: 1.55; }
      .dark-total { display: grid; gap: 11px; }
      .dark-total > div { display: flex; justify-content: space-between; gap: 18px; }
      .dark-total span { color: #aab2c0; }
      .dark-grand { margin-top: 5px; padding: 15px; background: var(--invoice-accent); color: #101318; }
      .dark-grand span { color: #101318; font-weight: 800; }
    `,
  },
];

export const invoiceTemplateCategories = [
  "All",
  ...Array.from(new Set(invoiceTemplates.map((template) => template.category))),
];

export function getInvoiceTemplate(templateId) {
  return invoiceTemplates.find((template) => template.id === templateId) || null;
}
const DEFAULT_APPEARANCE = {
  accentColor: "#2563eb",
  textColor: "#172033",
  baseFontSize: 14,
  fontFamily: "Arial, sans-serif",
};

const ALLOWED_FONT_FAMILIES = new Set([
  "Arial, sans-serif",
  "Georgia, serif",
  '"Times New Roman", serif',
  "Verdana, sans-serif",
  '"Trebuchet MS", sans-serif',
]);

export function calculateInvoiceTotals(invoice) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + toNumber(item.quantity) * toNumber(item.rate),
    0,
  );
  const taxAmount = subtotal * (toNumber(invoice.taxRate) / 100);
  const discount = toNumber(invoice.discount);

  return {
    subtotal,
    taxAmount,
    discount,
    total: Math.max(0, subtotal + taxAmount - discount),
  };
}

export function formatMoney(currency, value, locale = "en-IN") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(toNumber(value));
  } catch {
    return `${currency || "INR"} ${toNumber(value).toFixed(2)}`;
  }
}

export function buildStandaloneInvoiceHtml({
  invoice,
  template,
  appearance = DEFAULT_APPEARANCE,
}) {
  if (!template) {
    throw new Error("A valid invoice template is required.");
  }

  const totals = calculateInvoiceTotals(invoice);
  const safeAppearance = normalizeAppearance(appearance);
  const context = createTemplateContext(invoice, totals);
  const bodyMarkup = compileTemplate(template.html, context);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(invoice.invoiceNumber || "Invoice")}</title>
  <style>
    :root {
      --invoice-accent: ${safeAppearance.accentColor};
      --invoice-text: ${safeAppearance.textColor};
      --invoice-font-size: ${safeAppearance.baseFontSize}px;
      --invoice-font-family: ${safeAppearance.fontFamily};
    }

    @page {
      size: A4;
      margin: 0;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: var(--invoice-text);
      font-family: var(--invoice-font-family);
      font-size: var(--invoice-font-size);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    table {
      border-collapse: collapse;
    }

    thead {
      display: table-header-group;
    }

    tfoot {
      display: table-footer-group;
    }

    tr,
    img,
    .avoid-break {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .invoice-page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: #ffffff;
    }

    ${template.css}
  </style>
</head>
<body>
  ${bodyMarkup}
</body>
</html>`;
}

export function normalizeAppearance(appearance = {}) {
  const accentColor = isHexColor(appearance.accentColor)
    ? appearance.accentColor
    : DEFAULT_APPEARANCE.accentColor;
  const textColor = isHexColor(appearance.textColor)
    ? appearance.textColor
    : DEFAULT_APPEARANCE.textColor;
  const baseFontSize = clamp(Number(appearance.baseFontSize) || 14, 11, 20);
  const fontFamily = ALLOWED_FONT_FAMILIES.has(appearance.fontFamily)
    ? appearance.fontFamily
    : DEFAULT_APPEARANCE.fontFamily;

  return { accentColor, textColor, baseFontSize, fontFamily };
}

function createTemplateContext(invoice, totals) {
  const currency = invoice.currency || "INR";

  return {
    ...invoice,
    sender: invoice.sender || {},
    client: invoice.client || {},
    items: (invoice.items || []).map((item, index) => ({
      ...item,
      index: index + 1,
      quantity: toNumber(item.quantity),
      rate: toNumber(item.rate),
      rateFormatted: formatMoney(currency, item.rate),
      amountFormatted: formatMoney(
        currency,
        toNumber(item.quantity) * toNumber(item.rate),
      ),
    })),
    subtotalFormatted: formatMoney(currency, totals.subtotal),
    taxAmountFormatted: formatMoney(currency, totals.taxAmount),
    discountFormatted: formatMoney(currency, totals.discount),
    totalFormatted: formatMoney(currency, totals.total),
  };
}

/**
 * Small trusted-template compiler.
 * Supported syntax:
 *   {{invoiceNumber}}
 *   {{sender.name}}
 *   {{#if dueDate}}...{{/if}}
 *   {{#each items}}...{{description}}...{{/each}}
 *
 * Template HTML/CSS is treated as trusted application code.
 * User-entered invoice values are HTML-escaped before insertion.
 */
export function compileTemplate(templateHtml, context) {
  let output = String(templateHtml || "");

  output = output.replace(
    /{{#each\s+([\w.]+)}}([\s\S]*?){{\/each}}/g,
    (_, path, block) => {
      const collection = getByPath(context, path);
      if (!Array.isArray(collection)) return "";

      return collection
        .map((entry) => {
          const itemContext = {
            ...context,
            ...(entry && typeof entry === "object" ? entry : { value: entry }),
          };
          return replaceConditionalsAndTokens(block, itemContext);
        })
        .join("");
    },
  );

  return replaceConditionalsAndTokens(output, context);
}

function replaceConditionalsAndTokens(input, context) {
  let output = input.replace(
    /{{#if\s+([\w.]+)}}([\s\S]*?){{\/if}}/g,
    (_, path, block) => (getByPath(context, path) ? block : ""),
  );

  output = output.replace(/{{\s*([\w.]+)\s*}}/g, (_, path) => {
    const value = getByPath(context, path);
    return escapeHtml(value ?? "");
  });

  return output;
}

function getByPath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value || ""));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

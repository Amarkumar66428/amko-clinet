import Handlebars from "handlebars";

const FONT_STACKS = {
  Inter: "Inter, Arial, sans-serif",

  Arial: "Arial, sans-serif",

  Georgia: "Georgia, serif",

  Helvetica: "Helvetica, Arial, sans-serif",

  Times: "'Times New Roman', serif",
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

function safeColor(value, fallback) {
  if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)) {
    return value;
  }

  return fallback;
}

function money(currency, value) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(Number(value || 0));
  } catch {
    return `${currency} ${Number(value || 0).toFixed(2)}`;
  }
}

function createViewModel(invoice) {
  const items = invoice.items.map((item) => {
    const quantity = Number(item.quantity || 0);

    const rate = Number(item.rate || 0);

    const amount = quantity * rate;

    return {
      ...item,

      quantity,
      rate,

      rateFormatted: money(invoice.currency, rate),

      amountFormatted: money(invoice.currency, amount),
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );

  const taxAmount = subtotal * (Number(invoice.taxRate || 0) / 100);

  const discount = Number(invoice.discount || 0);

  const total = Math.max(0, subtotal + taxAmount - discount);

  return {
    ...invoice,

    items,

    subtotalFormatted: money(invoice.currency, subtotal),

    taxAmountFormatted: money(invoice.currency, taxAmount),

    discountFormatted: money(invoice.currency, discount),

    totalFormatted: money(invoice.currency, total),
  };
}

export function buildPreviewDocument({ template, invoice, appearance }) {
  const viewModel = createViewModel(invoice);

  const compiled = Handlebars.compile(template.html);

  const markup = compiled(viewModel);

  const accentColor = safeColor(appearance.accentColor, "#2563eb");

  const textColor = safeColor(appearance.textColor, "#172033");

  const fontSize = clamp(appearance.fontSize, 10, 20);

  const fontFamily = FONT_STACKS[appearance.fontFamily] || FONT_STACKS.Inter;

  return `
<!doctype html>

<html>

<head>

<meta charset="utf-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
/>

<style>

* {
  box-sizing: border-box;
}

html,
body {
  padding: 0;
  margin: 0;
}

@page {
  size: A4;
  margin: 0;
}

:root {
  --invoice-accent: ${accentColor};
  --invoice-text: ${textColor};
  --invoice-font-size: ${fontSize}px;
  --invoice-font-family: ${fontFamily};
}

body {
  background: #ffffff;

  color:
    var(--invoice-text);

  font-family:
    var(--invoice-font-family);

  font-size:
    var(--invoice-font-size);

  -webkit-print-color-adjust:
    exact !important;

  print-color-adjust:
    exact !important;
}

.invoice-page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
}

table {
  border-collapse: collapse;
}

thead {
  display:
    table-header-group;
}

tr,
.invoice-totals {
  break-inside: avoid;
  page-break-inside: avoid;
}

${template.css}

</style>

</head>

<body>

${markup}

</body>

</html>
`;
}

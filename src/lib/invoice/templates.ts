import type { InvoiceTemplate, TemplateId } from "./types";

export const INVOICE_TEMPLATES: readonly InvoiceTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    category: "Business",
    description: "Clean layout with a coloured table header and a bold amount due.",
    isFree: true,
    defaultAppearance: {
      fontFamily: "Inter", fontSize: 10, accentColor: "#2563eb", textColor: "#172033",
      spacing: 1, lineHeight: 1.4, margin: 48,
    },
  },
  {
    id: "bold",
    name: "Bold",
    category: "Creative",
    description: "Full-width colour band header that puts your brand up front.",
    isFree: true,
    defaultAppearance: {
      fontFamily: "Roboto", fontSize: 10, accentColor: "#0f766e", textColor: "#1f2937",
      spacing: 1, lineHeight: 1.4, margin: 48,
    },
  },
  {
    id: "classic",
    name: "Classic",
    category: "Professional",
    description: "Traditional serif letterhead with a ruled, bordered item table.",
    isFree: true,
    defaultAppearance: {
      fontFamily: "Noto Serif", fontSize: 10, accentColor: "#7c2d12", textColor: "#1c1917",
      spacing: 1, lineHeight: 1.4, margin: 48,
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Simple",
    description: "Quiet typography and hairline rules; colour only where it counts.",
    isFree: true,
    defaultAppearance: {
      fontFamily: "Inter", fontSize: 9.5, accentColor: "#111827", textColor: "#111827",
      spacing: 1, lineHeight: 1.4, margin: 56,
    },
  },
];

export function getInvoiceTemplate(id: string): InvoiceTemplate | undefined {
  return INVOICE_TEMPLATES.find((template) => template.id === id);
}

export function isTemplateId(id: string): id is TemplateId {
  return INVOICE_TEMPLATES.some((template) => template.id === id);
}

export const templateThumbnail = (id: TemplateId) => `/invoice-templates/${id}.webp`;

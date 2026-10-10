export interface Party {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type PartyKey = "sender" | "client";

/** Numeric fields hold strings while the user is typing; they are parsed with toNumber() when used. */
export type NumericInput = number | string;

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: NumericInput;
  rate: NumericInput;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  sender: Party;
  client: Party;
  items: InvoiceItem[];
  taxLabel: string;
  taxRate: NumericInput;
  discount: NumericInput;
  notes: string;
  /** PNG or JPEG data URL, already downscaled for embedding. */
  logo: string | null;
}

export type InvoiceField =
  | "invoiceNumber"
  | "invoiceDate"
  | "dueDate"
  | "currency"
  | "taxLabel"
  | "taxRate"
  | "discount"
  | "notes";
export type InvoiceItemField = Exclude<keyof InvoiceItem, "id">;

export type InvoiceAction =
  | { type: "SET_FIELD"; field: InvoiceField; value: string }
  | { type: "SET_PARTY_FIELD"; party: PartyKey; field: keyof Party; value: string }
  | { type: "SET_LOGO"; value: string | null }
  | { type: "UPDATE_ITEM"; id: string; field: InvoiceItemField; value: string }
  | { type: "ADD_ITEM" }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "RESET"; invoice: Invoice };

export interface InvoiceTotals {
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
}

export const FONT_FAMILIES = ["Inter", "Roboto", "Noto Serif"] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

export interface Appearance {
  fontFamily: FontFamily;
  /** Base body size in PDF points. */
  fontSize: number;
  accentColor: string;
  textColor: string;
}

export type TemplateId = "modern" | "bold" | "classic" | "minimal";

export interface InvoiceTemplate {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  isFree: boolean;
  defaultAppearance: Appearance;
}

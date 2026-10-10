/** A user-defined detail on a party, e.g. { label: "GSTIN", value: "29ABCDE1234F1Z5" }. */
export interface PartyCustomField {
  id: string;
  label: string;
  value: string;
}

export interface Party {
  name: string;
  email: string;
  phone: string;
  address: string;
  customFields: PartyCustomField[];
}

export type PartyTextField = Exclude<keyof Party, "customFields">;

export type PartyKey = "sender" | "client";

/** Numeric fields hold strings while the user is typing; they are parsed with toNumber() when used. */
export type NumericInput = number | string;

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: NumericInput;
  rate: NumericInput;
  /** Values for the invoice's custom columns, keyed by column id. */
  custom: Record<string, string>;
}

/** An extra, user-named text column in the items table (e.g. "HSN code", "Size"). */
export interface CustomColumn {
  id: string;
  label: string;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  sender: Party;
  client: Party;
  items: InvoiceItem[];
  customColumns: CustomColumn[];
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
export type InvoiceItemField = Exclude<keyof InvoiceItem, "id" | "custom">;

export type InvoiceAction =
  | { type: "SET_FIELD"; field: InvoiceField; value: string }
  | { type: "SET_PARTY_FIELD"; party: PartyKey; field: PartyTextField; value: string }
  | { type: "ADD_PARTY_CUSTOM_FIELD"; party: PartyKey }
  | { type: "UPDATE_PARTY_CUSTOM_FIELD"; party: PartyKey; id: string; key: "label" | "value"; value: string }
  | { type: "REMOVE_PARTY_CUSTOM_FIELD"; party: PartyKey; id: string }
  | { type: "SET_LOGO"; value: string | null }
  | { type: "UPDATE_ITEM"; id: string; field: InvoiceItemField; value: string }
  | { type: "SET_ITEM_CUSTOM"; id: string; columnId: string; value: string }
  | { type: "ADD_ITEM" }
  | { type: "ADD_COLUMN" }
  | { type: "RENAME_COLUMN"; id: string; label: string }
  | { type: "REMOVE_COLUMN"; id: string }
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
  /** Multiplier for the gaps between sections and the padding of table rows (1 = template default). */
  spacing: number;
  /** Line height of body text, as a multiple of the font size. */
  lineHeight: number;
  /** Page margin in PDF points. */
  margin: number;
}

export type Orientation = "portrait" | "landscape";

export type TemplateId = "modern" | "bold" | "classic" | "minimal";

export interface InvoiceTemplate {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  isFree: boolean;
  defaultAppearance: Appearance;
}

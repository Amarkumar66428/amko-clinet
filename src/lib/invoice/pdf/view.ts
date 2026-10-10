import { formatDate, formatMoney, formatQuantity, toNumber } from "../format";
import { calculateTotals, lineAmount } from "../state";
import type { Invoice, Party } from "../types";

export interface PartyView {
  name: string;
  email: string;
  phone: string;
  address: string;
  /** Custom fields with a value, ready to print as "Label: value". */
  customLines: string[];
  isEmpty: boolean;
}

export interface LineView {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  amount: string;
  /** Custom column values, in the same order as `InvoiceView.columns`. */
  custom: string[];
}

/** Everything a template renders, pre-formatted so templates contain layout only. */
export interface InvoiceView {
  number: string;
  issueDate: string;
  dueDate: string;
  sender: PartyView;
  client: PartyView;
  logo: string | null;
  /** Header labels of the custom columns shown between Description and Qty. */
  columns: string[];
  items: LineView[];
  subtotal: string;
  tax: { label: string; amount: string } | null;
  discount: string | null;
  total: string;
  notes: string;
}

const trimParty = (party: Party): PartyView => {
  const trimmed = {
    name: party.name.trim(),
    email: party.email.trim(),
    phone: party.phone.trim(),
    address: party.address.trim(),
  };
  const customLines = party.customFields
    .filter((field) => field.value.trim())
    .map((field) => (field.label.trim() ? `${field.label.trim()}: ${field.value.trim()}` : field.value.trim()));
  return {
    ...trimmed,
    customLines,
    isEmpty: !Object.values(trimmed).some(Boolean) && customLines.length === 0,
  };
};

export function buildInvoiceView(invoice: Invoice): InvoiceView {
  const money = (value: number) => formatMoney(value, invoice.currency);
  const totals = calculateTotals(invoice);
  const taxRate = toNumber(invoice.taxRate);

  const columnIds = invoice.customColumns.map((col) => col.id);
  const items = invoice.items
    .map((item) => ({ item, custom: columnIds.map((id) => item.custom[id]?.trim() ?? "") }))
    // Blank rows are editor scaffolding, not invoice lines.
    .filter(({ item, custom }) => item.description.trim() || lineAmount(item) !== 0 || custom.some(Boolean))
    .map(({ item, custom }) => ({
      id: item.id,
      description: item.description.trim(),
      quantity: formatQuantity(toNumber(item.quantity)),
      rate: money(toNumber(item.rate)),
      amount: money(lineAmount(item)),
      custom,
    }));

  return {
    number: invoice.invoiceNumber.trim(),
    issueDate: formatDate(invoice.invoiceDate),
    dueDate: formatDate(invoice.dueDate),
    sender: trimParty(invoice.sender),
    client: trimParty(invoice.client),
    logo: invoice.logo,
    columns: invoice.customColumns.map((col, i) => col.label.trim() || `Column ${i + 1}`),
    items,
    subtotal: money(totals.subtotal),
    tax: totals.taxAmount
      ? { label: `${invoice.taxLabel.trim() || "Tax"} (${formatQuantity(taxRate)}%)`, amount: money(totals.taxAmount) }
      : null,
    discount: totals.discount ? `-${money(totals.discount)}` : null,
    total: money(totals.total),
    notes: invoice.notes.trim(),
  };
}

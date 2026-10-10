import { formatDate, formatMoney, formatQuantity, toNumber } from "../format";
import { calculateTotals, lineAmount } from "../state";
import type { Invoice, Party } from "../types";

export interface PartyView extends Party {
  isEmpty: boolean;
}

export interface LineView {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  amount: string;
}

/** Everything a template renders, pre-formatted so templates contain layout only. */
export interface InvoiceView {
  number: string;
  issueDate: string;
  dueDate: string;
  sender: PartyView;
  client: PartyView;
  logo: string | null;
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
  return { ...trimmed, isEmpty: !Object.values(trimmed).some(Boolean) };
};

export function buildInvoiceView(invoice: Invoice): InvoiceView {
  const money = (value: number) => formatMoney(value, invoice.currency);
  const totals = calculateTotals(invoice);
  const taxRate = toNumber(invoice.taxRate);

  const items = invoice.items
    // Blank rows are editor scaffolding, not invoice lines.
    .filter((item) => item.description.trim() || lineAmount(item) !== 0)
    .map((item) => ({
      id: item.id,
      description: item.description.trim(),
      quantity: formatQuantity(toNumber(item.quantity)),
      rate: money(toNumber(item.rate)),
      amount: money(lineAmount(item)),
    }));

  return {
    number: invoice.invoiceNumber.trim(),
    issueDate: formatDate(invoice.invoiceDate),
    dueDate: formatDate(invoice.dueDate),
    sender: trimParty(invoice.sender),
    client: trimParty(invoice.client),
    logo: invoice.logo,
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

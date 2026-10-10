import { roundMoney, todayIso, toNumber } from "./format";
import type { Invoice, InvoiceAction, InvoiceItem, InvoiceTotals, Party } from "./types";

export const MAX_ITEMS = 100;

export const createItem = (): InvoiceItem => ({ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 });

export const emptyParty = (): Party => ({ name: "", email: "", phone: "", address: "" });

export const createInitialInvoice = (): Invoice => ({
  invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
  invoiceDate: todayIso(),
  dueDate: "",
  currency: "INR",
  sender: emptyParty(),
  client: emptyParty(),
  items: [{ ...createItem(), description: "Website Design", rate: 1500 }],
  taxLabel: "Tax",
  taxRate: 0,
  discount: 0,
  notes: "",
  logo: null,
});

export function invoiceReducer(state: Invoice, action: InvoiceAction): Invoice {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_PARTY_FIELD":
      return { ...state, [action.party]: { ...state[action.party], [action.field]: action.value } };
    case "SET_LOGO":
      return { ...state, logo: action.value };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item,
        ),
      };
    case "ADD_ITEM":
      if (state.items.length >= MAX_ITEMS) return state;
      return { ...state, items: [...state.items, createItem()] };
    case "REMOVE_ITEM":
      if (state.items.length === 1) return state;
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case "RESET":
      return action.invoice;
    default:
      return state;
  }
}

export const lineAmount = (item: InvoiceItem): number => roundMoney(toNumber(item.quantity) * toNumber(item.rate));

export function calculateTotals(invoice: Invoice): InvoiceTotals {
  const subtotal = roundMoney(invoice.items.reduce((sum, item) => sum + lineAmount(item), 0));
  const taxAmount = roundMoney(subtotal * (Math.max(0, toNumber(invoice.taxRate)) / 100));
  const discount = roundMoney(Math.max(0, toNumber(invoice.discount)));
  return { subtotal, taxAmount, discount, total: Math.max(0, roundMoney(subtotal + taxAmount - discount)) };
}

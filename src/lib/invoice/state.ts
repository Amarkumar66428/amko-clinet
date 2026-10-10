import { roundMoney, todayIso, toNumber } from "./format";
import type { Invoice, InvoiceAction, InvoiceItem, InvoiceTotals, Party, PartyCustomField, PartyKey } from "./types";

export const MAX_ITEMS = 100;
export const MAX_PARTY_CUSTOM_FIELDS = 6;
/** More than this leaves too little room for the description column on an A4 page. */
export const MAX_CUSTOM_COLUMNS = 3;

export const createItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  rate: 0,
  custom: {},
});

export const emptyParty = (): Party => ({ name: "", email: "", phone: "", address: "", customFields: [] });

const updateCustomFields = (
  state: Invoice,
  party: PartyKey,
  update: (fields: PartyCustomField[]) => PartyCustomField[],
): Invoice => ({ ...state, [party]: { ...state[party], customFields: update(state[party].customFields) } });

export const createInitialInvoice = (): Invoice => ({
  invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
  invoiceDate: todayIso(),
  dueDate: "",
  currency: "INR",
  sender: emptyParty(),
  client: emptyParty(),
  items: [{ ...createItem(), description: "Website Design", rate: 1500 }],
  customColumns: [],
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
    case "ADD_PARTY_CUSTOM_FIELD":
      if (state[action.party].customFields.length >= MAX_PARTY_CUSTOM_FIELDS) return state;
      return updateCustomFields(state, action.party, (fields) => [
        ...fields,
        { id: crypto.randomUUID(), label: "", value: "" },
      ]);
    case "UPDATE_PARTY_CUSTOM_FIELD":
      return updateCustomFields(state, action.party, (fields) =>
        fields.map((field) => (field.id === action.id ? { ...field, [action.key]: action.value } : field)),
      );
    case "REMOVE_PARTY_CUSTOM_FIELD":
      return updateCustomFields(state, action.party, (fields) => fields.filter((field) => field.id !== action.id));
    case "SET_LOGO":
      return { ...state, logo: action.value };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item,
        ),
      };
    case "SET_ITEM_CUSTOM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, custom: { ...item.custom, [action.columnId]: action.value } } : item,
        ),
      };
    case "ADD_COLUMN":
      if (state.customColumns.length >= MAX_CUSTOM_COLUMNS) return state;
      return { ...state, customColumns: [...state.customColumns, { id: crypto.randomUUID(), label: "" }] };
    case "RENAME_COLUMN":
      return {
        ...state,
        customColumns: state.customColumns.map((col) => (col.id === action.id ? { ...col, label: action.label } : col)),
      };
    case "REMOVE_COLUMN":
      return {
        ...state,
        customColumns: state.customColumns.filter((col) => col.id !== action.id),
        items: state.items.map((item) => {
          const custom = { ...item.custom };
          delete custom[action.id];
          return { ...item, custom };
        }),
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

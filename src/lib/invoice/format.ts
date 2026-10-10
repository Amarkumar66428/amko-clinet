import type { NumericInput } from "./types";

export const CURRENCIES = [
  { code: "INR", name: "Indian Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "AED", name: "UAE Dirham" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "JPY", name: "Japanese Yen" },
] as const;

// en-IN gives lakh/crore grouping for rupees; everything else uses US-style grouping.
const LOCALE_BY_CURRENCY: Record<string, string> = { INR: "en-IN" };

const moneyFormatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(value: number, currency: string): string {
  let formatter = moneyFormatters.get(currency);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency] ?? "en-US", { style: "currency", currency });
    } catch {
      return `${currency} ${value.toFixed(2)}`;
    }
    moneyFormatters.set(currency, formatter);
  }
  return formatter.format(value);
}

const quantityFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 });

export function formatQuantity(value: number): string {
  return quantityFormatter.format(value);
}

// Fixed names: ICU versions disagree on abbreviations ("Sep" vs "Sept"), and PDFs must be reproducible.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats a `YYYY-MM-DD` input value as e.g. "22 Aug 2026" without timezone drift. */
export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const [, year, month, day] = match;
  return MONTHS[Number(month) - 1] ? `${day} ${MONTHS[Number(month) - 1]} ${year}` : isoDate;
}

export function toNumber(value: NumericInput | null | undefined): number {
  const n = typeof value === "number" ? value : Number.parseFloat(value ?? "");
  return Number.isFinite(n) ? n : 0;
}

/** Rounds to cents so displayed lines always add up to the displayed totals. */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Strips characters that are invalid in file names on common operating systems. */
export function toPdfFilename(name: string): string {
  const safe = name.replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "-").trim();
  return `${safe || "invoice"}.pdf`;
}

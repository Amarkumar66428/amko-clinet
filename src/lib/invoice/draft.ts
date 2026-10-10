import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { CURRENCIES } from "./format";
import { MAX_ITEMS, createInitialInvoice, createItem, emptyParty, invoiceReducer } from "./state";
import {
  FONT_FAMILIES,
  type Appearance,
  type Invoice,
  type InvoiceItem,
  type InvoiceTemplate,
  type NumericInput,
  type Party,
  type TemplateId,
} from "./types";

const STORAGE_KEY = "amko:invoice-draft:v1";
const SAVE_DELAY_MS = 400;

export const FONT_SIZE_RANGE = { min: 8, max: 13, step: 0.5 } as const;

type AppearanceMap = Partial<Record<TemplateId, Appearance>>;

interface Draft {
  invoice: Invoice;
  appearance: AppearanceMap;
}

export type SaveStatus = "idle" | "saved" | "error";

// ---------------------------------------------------------------------------
// Validation: localStorage is user-controlled and may hold data from older versions.
// ---------------------------------------------------------------------------

type Loose = Record<string, unknown>;

const isObject = (value: unknown): value is Loose => typeof value === "object" && value !== null;
const str = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
const numeric = (value: unknown, fallback: NumericInput): NumericInput =>
  typeof value === "number" || typeof value === "string" ? value : fallback;
const isHexColor = (value: unknown): value is string => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
const isImageDataUrl = (value: unknown): value is string =>
  typeof value === "string" && /^data:image\/(png|jpeg);base64,/.test(value);

function normalizeParty(raw: unknown): Party {
  const party = isObject(raw) ? raw : {};
  const base = emptyParty();
  return {
    name: str(party.name, base.name),
    email: str(party.email, base.email),
    phone: str(party.phone, base.phone),
    address: str(party.address, base.address),
  };
}

function normalizeItems(raw: unknown): InvoiceItem[] {
  const items = Array.isArray(raw) ? raw.filter(isObject).slice(0, MAX_ITEMS) : [];
  const seen = new Set<string>();
  const normalized = items.map((item) => {
    let id = str(item.id);
    if (!id || seen.has(id)) id = crypto.randomUUID();
    seen.add(id);
    return { id, description: str(item.description), quantity: numeric(item.quantity, 1), rate: numeric(item.rate, 0) };
  });
  return normalized.length ? normalized : [createItem()];
}

export function normalizeInvoice(raw: unknown): Invoice {
  const base = createInitialInvoice();
  if (!isObject(raw)) return base;
  const currency = str(raw.currency);
  return {
    invoiceNumber: str(raw.invoiceNumber, base.invoiceNumber),
    invoiceDate: str(raw.invoiceDate, base.invoiceDate),
    dueDate: str(raw.dueDate),
    currency: CURRENCIES.some((c) => c.code === currency) ? currency : base.currency,
    sender: normalizeParty(raw.sender),
    client: normalizeParty(raw.client),
    items: normalizeItems(raw.items),
    taxLabel: str(raw.taxLabel, base.taxLabel),
    taxRate: numeric(raw.taxRate, base.taxRate),
    discount: numeric(raw.discount, base.discount),
    notes: str(raw.notes),
    logo: isImageDataUrl(raw.logo) ? raw.logo : null,
  };
}

export function normalizeAppearance(raw: unknown, fallback: Appearance): Appearance {
  if (!isObject(raw)) return fallback;
  const fontSize = typeof raw.fontSize === "number" && Number.isFinite(raw.fontSize) ? raw.fontSize : fallback.fontSize;
  return {
    fontFamily: FONT_FAMILIES.find((f) => f === raw.fontFamily) ?? fallback.fontFamily,
    fontSize: Math.min(FONT_SIZE_RANGE.max, Math.max(FONT_SIZE_RANGE.min, fontSize)),
    accentColor: isHexColor(raw.accentColor) ? raw.accentColor : fallback.accentColor,
    textColor: isHexColor(raw.textColor) ? raw.textColor : fallback.textColor,
  };
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

function loadDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed)) return null;
    return {
      invoice: normalizeInvoice(parsed.invoice),
      appearance: isObject(parsed.appearance) ? (parsed.appearance as AppearanceMap) : {},
    };
  } catch {
    return null;
  }
}

function saveDraft(draft: Draft): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch {
    // Quota exceeded or storage disabled (e.g. private mode): the editor keeps working in memory.
    return false;
  }
}

/**
 * Invoice + per-template appearance state, persisted to localStorage.
 * Reads storage during initialisation, so it must only run in client-only components.
 */
export function useInvoiceDraft(template: InvoiceTemplate) {
  const [initial] = useState(loadDraft);
  const [invoice, dispatch] = useReducer(invoiceReducer, undefined, () => initial?.invoice ?? createInitialInvoice());
  const [appearances, setAppearances] = useState<AppearanceMap>(() => initial?.appearance ?? {});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const storedAppearance = appearances[template.id];
  const appearance = useMemo(
    () => normalizeAppearance(storedAppearance, template.defaultAppearance),
    [storedAppearance, template],
  );

  const templateId = template.id;
  const setAppearance = useCallback(
    (next: Appearance) => setAppearances((prev) => ({ ...prev, [templateId]: next })),
    [templateId],
  );
  const resetAppearance = useCallback(
    () =>
      setAppearances((prev) => {
        const rest = { ...prev };
        delete rest[templateId];
        return rest;
      }),
    [templateId],
  );
  const resetInvoice = useCallback(() => dispatch({ type: "RESET", invoice: createInitialInvoice() }), []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSaveStatus(saveDraft({ invoice, appearance: appearances }) ? "saved" : "error");
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [invoice, appearances]);

  return { invoice, dispatch, appearance, setAppearance, resetAppearance, resetInvoice, saveStatus };
}

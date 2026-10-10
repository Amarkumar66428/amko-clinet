import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { CURRENCIES } from "./format";
import { idbGet, idbSet } from "./db";
import {
  MAX_CUSTOM_COLUMNS,
  MAX_ITEMS,
  MAX_PARTY_CUSTOM_FIELDS,
  createInitialInvoice, createItem,   emptyParty,
  invoiceReducer,
} from "./state";
import {
  FONT_FAMILIES,
  type Appearance,
  type CustomColumn,
  type Invoice,
  type InvoiceItem,
  type InvoiceTemplate,
  type NumericInput,
  type Orientation,
  type Party,
  type TemplateId,
} from "./types";

const DRAFT_KEY = "current";
/** Where drafts lived before IndexedDB; still read once so existing drafts carry over. */
const LEGACY_STORAGE_KEY = "amk:invoice-draft:v1";
const AUTOSAVE_DELAY_MS = 800;

export const FONT_SIZE_RANGE = { min: 8, max: 13, step: 0.5 } as const;
export const SPACING_RANGE = { min: 0.5, max: 1.8, step: 0.05 } as const;
export const LINE_HEIGHT_RANGE = { min: 1.1, max: 2, step: 0.05 } as const;
export const MARGIN_RANGE = { min: 20, max: 80, step: 2 } as const;

type AppearanceMap = Partial<Record<TemplateId, Appearance>>;

export interface Draft {
  invoice: Invoice;
  appearance: AppearanceMap;
  orientation: Orientation;
}

export type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

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

function normalizePartyCustomFields(raw: unknown): Party["customFields"] {
  const fields = Array.isArray(raw) ? raw.filter(isObject).slice(0, MAX_PARTY_CUSTOM_FIELDS) : [];
  const seen = new Set<string>();
  return fields.map((field) => {
    let id = str(field.id);
    if (!id || seen.has(id)) id = crypto.randomUUID();
    seen.add(id);
    return { id, label: str(field.label), value: str(field.value) };
  });
}

function normalizeParty(raw: unknown): Party {
  const party = isObject(raw) ? raw : {};
  const base = emptyParty();
  return {
    name: str(party.name, base.name),
    email: str(party.email, base.email),
    phone: str(party.phone, base.phone),
    address: str(party.address, base.address),
    customFields: normalizePartyCustomFields(party.customFields),
  };
}

function normalizeColumns(raw: unknown): CustomColumn[] {
  const columns = Array.isArray(raw) ? raw.filter(isObject).slice(0, MAX_CUSTOM_COLUMNS) : [];
  const seen = new Set<string>();
  return columns
    .map((col) => ({ id: str(col.id), label: str(col.label) }))
    .filter((col) => col.id && !seen.has(col.id) && seen.add(col.id));
}

function normalizeItems(raw: unknown, columns: CustomColumn[]): InvoiceItem[] {
  const items = Array.isArray(raw) ? raw.filter(isObject).slice(0, MAX_ITEMS) : [];
  const seen = new Set<string>();
  const normalized = items.map((item) => {
    let id = str(item.id);
    if (!id || seen.has(id)) id = crypto.randomUUID();
    seen.add(id);
    const rawCustom = isObject(item.custom) ? item.custom : {};
    const custom: Record<string, string> = {};
    for (const col of columns) custom[col.id] = str(rawCustom[col.id]);
    return {
      id,
      description: str(item.description),
      quantity: numeric(item.quantity, 1),
      rate: numeric(item.rate, 0),
      custom,
    };
  });
  return normalized.length ? normalized : [createItem()];
}

export function normalizeInvoice(raw: unknown): Invoice {
  const base = createInitialInvoice();
  if (!isObject(raw)) return base;
  const currency = str(raw.currency);
  const customColumns = normalizeColumns(raw.customColumns);
  return {
    invoiceNumber: str(raw.invoiceNumber, base.invoiceNumber),
    invoiceDate: str(raw.invoiceDate, base.invoiceDate),
    dueDate: str(raw.dueDate),
    currency: CURRENCIES.some((c) => c.code === currency) ? currency : base.currency,
    sender: normalizeParty(raw.sender),
    client: normalizeParty(raw.client),
    items: normalizeItems(raw.items, customColumns),
    customColumns,
    taxLabel: str(raw.taxLabel, base.taxLabel),
    taxRate: numeric(raw.taxRate, base.taxRate),
    discount: numeric(raw.discount, base.discount),
    notes: str(raw.notes),
    logo: isImageDataUrl(raw.logo) ? raw.logo : null,
  };
}

/** A finite number clamped to `range`, or `fallback` when missing (e.g. drafts saved before the field existed). */
const inRange = (value: unknown, range: { min: number; max: number }, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(range.max, Math.max(range.min, value)) : fallback;

export function normalizeAppearance(raw: unknown, fallback: Appearance): Appearance {
  if (!isObject(raw)) return fallback;
  return {
    fontFamily: FONT_FAMILIES.find((f) => f === raw.fontFamily) ?? fallback.fontFamily,
    fontSize: inRange(raw.fontSize, FONT_SIZE_RANGE, fallback.fontSize),
    accentColor: isHexColor(raw.accentColor) ? raw.accentColor : fallback.accentColor,
    textColor: isHexColor(raw.textColor) ? raw.textColor : fallback.textColor,
    spacing: inRange(raw.spacing, SPACING_RANGE, fallback.spacing),
    lineHeight: inRange(raw.lineHeight, LINE_HEIGHT_RANGE, fallback.lineHeight),
    margin: inRange(raw.margin, MARGIN_RANGE, fallback.margin),
  };
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

function normalizeDraft(raw: unknown): Draft | null {
  if (!isObject(raw)) return null;
  return {
    invoice: normalizeInvoice(raw.invoice),
    appearance: isObject(raw.appearance) ? (raw.appearance as AppearanceMap) : {},
    orientation: raw.orientation === "landscape" ? "landscape" : "portrait",
  };
}

function loadLegacyDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? normalizeDraft(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

/** Reads the saved draft from IndexedDB, falling back to the old localStorage copy. */
export async function loadDraft(): Promise<Draft | null> {
  try {
    const draft = normalizeDraft(await idbGet(DRAFT_KEY));
    if (draft) return draft;
  } catch (error) {
    console.warn("Couldn't read the draft from IndexedDB:", error);
  }
  return loadLegacyDraft();
}

async function saveDraft(draft: Draft): Promise<void> {
  try {
    await idbSet(DRAFT_KEY, draft);
  } catch (error) {
    // IndexedDB unavailable (e.g. some private modes): fall back to localStorage. If that throws
    // too (quota, disabled), the caller reports the error and the editor keeps working in memory.
    console.warn("Couldn't save the draft to IndexedDB:", error);
    window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(draft));
    return;
  }
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY); // migrated
  } catch {
    // storage disabled; nothing to clean up
  }
}

/**
 * Invoice + per-template appearance state, persisted to IndexedDB. Changes autosave shortly after
 * editing stops, `saveNow` saves immediately, and pending changes are flushed when the page is
 * hidden or the editor unmounts, so a refresh or closed tab keeps what was typed.
 */
export function useInvoiceDraft(template: InvoiceTemplate, initial: Draft | null) {
  const [invoice, dispatch] = useReducer(invoiceReducer, undefined, () => initial?.invoice ?? createInitialInvoice());
  const [appearances, setAppearances] = useState<AppearanceMap>(() => initial?.appearance ?? {});
  const [orientation, setOrientation] = useState<Orientation>(() => initial?.orientation ?? "portrait");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(initial ? "saved" : "idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

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

  // Latest draft and its revision, readable from timers and unload handlers.
  const latest = useRef<Draft>({ invoice, appearance: appearances, orientation });
  const revision = useRef(0);
  const savedRevision = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const restored = useRef(false);

  const flush = useCallback(async (): Promise<boolean> => {
    window.clearTimeout(timer.current);
    const target = revision.current;
    if (target === savedRevision.current) return true;
    setSaveStatus("saving");
    try {
      await saveDraft(latest.current);
      savedRevision.current = Math.max(savedRevision.current, target);
      // Edits made while writing are still pending; their own autosave follows.
      setSaveStatus(revision.current === savedRevision.current ? "saved" : "unsaved");
      setSavedAt(new Date());
      return true;
    } catch (error) {
      console.error("Draft save failed:", error);
      setSaveStatus("error");
      return false;
    }
  }, []);

  /** Saves immediately, even when nothing changed since the last save (the user asked explicitly). */
  const saveNow = useCallback(() => {
    if (revision.current === savedRevision.current) revision.current++;
    return flush();
  }, [flush]);

  useEffect(() => {
    latest.current = { invoice, appearance: appearances, orientation };
    // The first run is the restored draft itself, which needs no save.
    if (!restored.current) {
      restored.current = true;
      return;
    }
    revision.current++;
    setSaveStatus("unsaved");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void flush(), AUTOSAVE_DELAY_MS);
  }, [invoice, appearances, orientation, flush]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      // Leaving the editor (e.g. switching template) must not drop a pending autosave.
      void flush();
    };
  }, [flush]);

  return {
    invoice,
    dispatch,
    appearance,
    setAppearance,
    resetAppearance,
    resetInvoice,
    orientation,
    setOrientation,
    saveStatus,
    savedAt,
    saveNow,
  };
}

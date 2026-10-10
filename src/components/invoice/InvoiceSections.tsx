import { memo, useId, useRef, useState, type ChangeEvent, type Dispatch, type InputHTMLAttributes } from "react";
import { CURRENCIES, formatMoney } from "@/lib/invoice/format";
import { LogoError, processLogo } from "@/lib/invoice/logo";
import { MAX_ITEMS, lineAmount } from "@/lib/invoice/state";
import type { Invoice, InvoiceAction, InvoiceField, InvoiceItemField, Party, PartyKey } from "@/lib/invoice/types";
import { FieldLabel, inputClass, labelTextClass, textareaClass } from "./EditorFields";

// Each section is the body of one toolbar tool; the workspace panel supplies the title and chrome.

type ChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;

interface SectionProps {
  invoice: Invoice;
  dispatch: Dispatch<InvoiceAction>;
}

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "className"> {
  label: string;
  value: string | number | undefined;
  onChange: ChangeHandler;
  className?: string;
}

function Field({ label, value, onChange, className, ...inputProps }: FieldProps) {
  return (
    <FieldLabel label={label} className={className}>
      <input className={inputClass} value={value ?? ""} onChange={onChange} {...inputProps} />
    </FieldLabel>
  );
}

const fieldSetter =
  (dispatch: Dispatch<InvoiceAction>, field: InvoiceField): ChangeHandler =>
  (e) =>
    dispatch({ type: "SET_FIELD", field, value: e.target.value });

const smallButtonClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

// ---------------------------------------------------------------------------
// Invoice details
// ---------------------------------------------------------------------------

export const DetailsSection = memo(function DetailsSection({ invoice, dispatch }: SectionProps) {
  const setField = (field: InvoiceField) => fieldSetter(dispatch, field);
  return (
    <div className="grid grid-cols-1 gap-x-3.5 sm:grid-cols-2">
      <Field label="Invoice number" value={invoice.invoiceNumber} maxLength={40} onChange={setField("invoiceNumber")} />
      <FieldLabel label="Currency">
        <select className={inputClass} value={invoice.currency} onChange={setField("currency")}>
          {CURRENCIES.map(({ code, name }) => (
            <option key={code} value={code}>
              {code} — {name}
            </option>
          ))}
        </select>
      </FieldLabel>
      <Field type="date" label="Invoice date" value={invoice.invoiceDate} onChange={setField("invoiceDate")} />
      <Field
        type="date"
        label="Due date"
        value={invoice.dueDate}
        min={invoice.invoiceDate || undefined}
        onChange={setField("dueDate")}
      />
    </div>
  );
});

// ---------------------------------------------------------------------------
// Parties
// ---------------------------------------------------------------------------

function LogoField({ logo, dispatch }: { logo: string | null; dispatch: Dispatch<InvoiceAction> }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      dispatch({ type: "SET_LOGO", value: await processLogo(file) });
    } catch (err) {
      setError(err instanceof LogoError ? err.message : "Could not use that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-[13px] flex flex-col gap-1.5">
      <span className={labelTextClass}>Logo</span>
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- local data URL, nothing to optimise
            <img src={logo} alt="Business logo" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-[10px] text-slate-400">No logo</span>
          )}
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="sr-only"
          onChange={handleFile}
        />
        <button type="button" className={smallButtonClass} disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? "Processing…" : logo ? "Replace" : "Upload"}
        </button>
        {logo && (
          <button type="button" className={smallButtonClass} onClick={() => dispatch({ type: "SET_LOGO", value: null })}>
            Remove
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export const PartySection = memo(function PartySection({
  party,
  invoice,
  dispatch,
}: SectionProps & { party: PartyKey }) {
  const setParty =
    (field: keyof Party): ChangeHandler =>
    (e) =>
      dispatch({ type: "SET_PARTY_FIELD", party, field, value: e.target.value });
  const isSender = party === "sender";

  return (
    <>
      {isSender && <LogoField logo={invoice.logo} dispatch={dispatch} />}
      <Field
        label={isSender ? "Business name" : "Client name"}
        value={invoice[party].name}
        maxLength={120}
        autoComplete={isSender ? "organization" : "off"}
        onChange={setParty("name")}
      />
      <div className="grid grid-cols-1 gap-x-3.5 sm:grid-cols-2">
        <Field
          type="email"
          label="Email"
          value={invoice[party].email}
          autoComplete={isSender ? "email" : "off"}
          onChange={setParty("email")}
        />
        <Field
          type="tel"
          label="Phone"
          value={invoice[party].phone}
          autoComplete={isSender ? "tel" : "off"}
          onChange={setParty("phone")}
        />
      </div>
      <FieldLabel label="Address">
        <textarea
          className={textareaClass}
          value={invoice[party].address}
          maxLength={500}
          onChange={setParty("address")}
        />
      </FieldLabel>
    </>
  );
});

// ---------------------------------------------------------------------------
// Line items
// ---------------------------------------------------------------------------

export const ItemsSection = memo(function ItemsSection({ invoice, dispatch }: SectionProps) {
  const setItem =
    (id: string, field: InvoiceItemField): ChangeHandler =>
    (e) =>
      dispatch({ type: "UPDATE_ITEM", id, field, value: e.target.value });
  const canAddItem = invoice.items.length < MAX_ITEMS;

  return (
    <>
      {invoice.items.map((item, index) => (
        <div
          className="grid grid-cols-[1fr_1fr_36px] items-end gap-2.5 border-b border-slate-200 py-3.5 first:pt-0"
          key={item.id}
        >
          <Field
            label={`Item ${index + 1}`}
            placeholder="Description"
            className="col-span-full"
            value={item.description}
            maxLength={300}
            onChange={setItem(item.id, "description")}
          />
          <Field
            label="Qty"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            className=""
            value={item.quantity}
            onChange={setItem(item.id, "quantity")}
          />
          <Field
            label="Rate"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            className=""
            value={item.rate}
            onChange={setItem(item.id, "rate")}
          />
          <button
            type="button"
            aria-label={`Remove item ${index + 1}`}
            disabled={invoice.items.length === 1}
            className="h-10 w-9 rounded-lg border border-slate-200 bg-white text-xl text-slate-500 transition hover:border-red-600/25 hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-500"
            onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
          >
            ×
          </button>
          <p className="col-span-full -mt-1 text-right text-[11px] text-slate-500">
            Amount: <strong className="text-ink">{formatMoney(lineAmount(item), invoice.currency)}</strong>
          </p>
        </div>
      ))}
      <button
        type="button"
        disabled={!canAddItem}
        className="mt-3.5 w-full rounded-xl border border-dashed border-blue-300 bg-blue-50 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => dispatch({ type: "ADD_ITEM" })}
      >
        + Add item
      </button>
      {!canAddItem && <p className="mt-2 text-xs text-slate-500">Maximum of {MAX_ITEMS} line items.</p>}
    </>
  );
});

// ---------------------------------------------------------------------------
// Tax, discount & notes
// ---------------------------------------------------------------------------

export const TaxNotesSection = memo(function TaxNotesSection({ invoice, dispatch }: SectionProps) {
  const setField = (field: InvoiceField) => fieldSetter(dispatch, field);
  return (
    <>
      <div className="grid grid-cols-2 gap-x-3.5">
        <Field
          label="Tax name"
          value={invoice.taxLabel}
          maxLength={20}
          placeholder="GST, VAT…"
          onChange={setField("taxLabel")}
        />
        <Field
          type="number"
          inputMode="decimal"
          min="0"
          max="100"
          step="any"
          label="Tax %"
          value={invoice.taxRate}
          onChange={setField("taxRate")}
        />
      </div>
      <Field
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        label={`Discount (${invoice.currency})`}
        value={invoice.discount}
        onChange={setField("discount")}
      />
      <FieldLabel label="Notes / payment terms">
        <textarea
          className={`${textareaClass} min-h-[120px]`}
          value={invoice.notes}
          maxLength={2000}
          placeholder="Bank details, payment terms, thank-you note…"
          onChange={setField("notes")}
        />
      </FieldLabel>
    </>
  );
});

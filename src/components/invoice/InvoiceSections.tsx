import { memo, useId, useRef, useState, type ChangeEvent, type Dispatch, type InputHTMLAttributes } from "react";
import { CURRENCIES, formatMoney } from "@/lib/invoice/format";
import { LogoError, processLogo } from "@/lib/invoice/logo";
import { MAX_CUSTOM_COLUMNS, MAX_ITEMS, MAX_PARTY_CUSTOM_FIELDS, lineAmount } from "@/lib/invoice/state";
import type {
  CustomColumn,
  Invoice,
  InvoiceAction,
  InvoiceField,
  InvoiceItem,
  InvoiceItemField,
  Party,
  PartyKey,
  PartyTextField,
} from "@/lib/invoice/types";
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

const removeButtonClass =
  "h-10 w-9 shrink-0 rounded-lg border border-slate-200 bg-white text-xl text-slate-500 transition hover:border-red-600/25 hover:bg-red-100 hover:text-red-600";

/** Label/value details the user adds themselves, e.g. GSTIN, PAN, website. */
function PartyCustomFields({
  party,
  fields,
  dispatch,
}: {
  party: PartyKey;
  fields: Party["customFields"];
  dispatch: Dispatch<InvoiceAction>;
}) {
  const canAdd = fields.length < MAX_PARTY_CUSTOM_FIELDS;
  return (
    <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className={labelTextClass}>Custom fields</span>
        <button
          type="button"
          disabled={!canAdd}
          className={smallButtonClass}
          onClick={() => dispatch({ type: "ADD_PARTY_CUSTOM_FIELD", party })}
        >
          + Add field
        </button>
      </div>
      {fields.length === 0 ? (
        <p className="mt-2 text-[11px] text-slate-500">
          Add details like GSTIN, PAN or website. They print as &ldquo;Label: value&rdquo;.
        </p>
      ) : (
        <ul className="mt-2.5 flex flex-col gap-2.5">
          {fields.map((field, index) => {
            const name = field.label.trim() || `field ${index + 1}`;
            const set = (key: "label" | "value") => (e: ChangeEvent<HTMLInputElement>) =>
              dispatch({ type: "UPDATE_PARTY_CUSTOM_FIELD", party, id: field.id, key, value: e.target.value });
            return (
              <li key={field.id} className="flex items-start gap-2">
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-[2fr_3fr]">
                  <input
                    className={inputClass}
                    aria-label={`Custom field ${index + 1} label`}
                    placeholder="Label, e.g. GSTIN"
                    maxLength={30}
                    value={field.label}
                    onChange={set("label")}
                  />
                  <input
                    className={inputClass}
                    aria-label={`Value for ${name}`}
                    placeholder="Value"
                    maxLength={120}
                    value={field.value}
                    onChange={set("value")}
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  className={removeButtonClass}
                  onClick={() => dispatch({ type: "REMOVE_PARTY_CUSTOM_FIELD", party, id: field.id })}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {!canAdd && <p className="mt-2 text-[11px] text-slate-500">Up to {MAX_PARTY_CUSTOM_FIELDS} custom fields.</p>}
    </div>
  );
}

export const PartySection = memo(function PartySection({
  party,
  invoice,
  dispatch,
}: SectionProps & { party: PartyKey }) {
  const setParty =
    (field: PartyTextField): ChangeHandler =>
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
      <PartyCustomFields party={party} fields={invoice[party].customFields} dispatch={dispatch} />
    </>
  );
});

// ---------------------------------------------------------------------------
// Line items
// ---------------------------------------------------------------------------

const columnLabel = (label: string, index: number) => label.trim() || `Column ${index + 1}`;

/** Extra item columns the user names themselves (e.g. "HSN code", "Size", "Batch no."). */
function CustomColumnsEditor({ invoice, dispatch }: SectionProps) {
  const columns = invoice.customColumns;
  const canAddColumn = columns.length < MAX_CUSTOM_COLUMNS;
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className={labelTextClass}>Extra columns</span>
        <button
          type="button"
          disabled={!canAddColumn}
          className={smallButtonClass}
          onClick={() => dispatch({ type: "ADD_COLUMN" })}
        >
          + Add column
        </button>
      </div>
      {columns.length === 0 ? (
        <p className="mt-2 text-[11px] text-slate-500">
          Add your own columns, like HSN code, size or batch number. They appear in the PDF table.
        </p>
      ) : (
        <ul className="mt-2.5 flex flex-col gap-2">
          {columns.map((col, index) => (
            <li key={col.id} className="flex items-center gap-2">
              <input
                className={inputClass}
                aria-label={`Name of extra column ${index + 1}`}
                placeholder={`Column ${index + 1} name, e.g. HSN code`}
                maxLength={30}
                value={col.label}
                onChange={(e) => dispatch({ type: "RENAME_COLUMN", id: col.id, label: e.target.value })}
              />
              <button
                type="button"
                aria-label={`Remove column ${columnLabel(col.label, index)}`}
                className={removeButtonClass}
                onClick={() => {
                  const hasValues = invoice.items.some((item) => item.custom[col.id]?.trim());
                  if (
                    !hasValues ||
                    window.confirm(`Remove "${columnLabel(col.label, index)}" and its values from all items?`)
                  ) {
                    dispatch({ type: "REMOVE_COLUMN", id: col.id });
                  }
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {!canAddColumn && (
        <p className="mt-2 text-[11px] text-slate-500">
          Up to {MAX_CUSTOM_COLUMNS} extra columns. Landscape gives them more room.
        </p>
      )}
    </div>
  );
}

interface ItemRowProps {
  item: InvoiceItem;
  index: number;
  columns: CustomColumn[];
  currency: string;
  canRemove: boolean;
  dispatch: Dispatch<InvoiceAction>;
}

/** Memoised so typing in one item re-renders only that row, not the whole (up to 100-row) list. */
const ItemRow = memo(function ItemRow({ item, index, columns, currency, canRemove, dispatch }: ItemRowProps) {
  const setItem =
    (field: InvoiceItemField): ChangeHandler =>
    (e) =>
      dispatch({ type: "UPDATE_ITEM", id: item.id, field, value: e.target.value });
  const setCustom =
    (columnId: string): ChangeHandler =>
    (e) =>
      dispatch({ type: "SET_ITEM_CUSTOM", id: item.id, columnId, value: e.target.value });

  return (
    <div className="grid grid-cols-[1fr_1fr_36px] items-end gap-2.5 border-b border-slate-200 py-3.5 first:pt-0">
      <Field
        label={`Item ${index + 1}`}
        placeholder="Description"
        className="col-span-full"
        value={item.description}
        maxLength={300}
        onChange={setItem("description")}
      />
      {columns.length > 0 && (
        <div className="col-span-full grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {columns.map((col, colIndex) => (
            <Field
              key={col.id}
              label={columnLabel(col.label, colIndex)}
              className=""
              maxLength={80}
              value={item.custom[col.id]}
              onChange={setCustom(col.id)}
            />
          ))}
        </div>
      )}
      <Field
        label="Qty"
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        className=""
        value={item.quantity}
        onChange={setItem("quantity")}
      />
      <Field
        label="Rate"
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        className=""
        value={item.rate}
        onChange={setItem("rate")}
      />
      <button
        type="button"
        aria-label={`Remove item ${index + 1}`}
        disabled={!canRemove}
        className="h-10 w-9 rounded-lg border border-slate-200 bg-white text-xl text-slate-500 transition hover:border-red-600/25 hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-500"
        onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
      >
        ×
      </button>
      <p className="col-span-full -mt-1 text-right text-[11px] text-slate-500">
        Amount: <strong className="text-ink">{formatMoney(lineAmount(item), currency)}</strong>
      </p>
    </div>
  );
});

export const ItemsSection = memo(function ItemsSection({ invoice, dispatch }: SectionProps) {
  const canAddItem = invoice.items.length < MAX_ITEMS;
  const canRemove = invoice.items.length > 1;

  return (
    <>
      <CustomColumnsEditor invoice={invoice} dispatch={dispatch} />
      {invoice.items.map((item, index) => (
        <ItemRow
          key={item.id}
          item={item}
          index={index}
          columns={invoice.customColumns}
          currency={invoice.currency}
          canRemove={canRemove}
          dispatch={dispatch}
        />
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

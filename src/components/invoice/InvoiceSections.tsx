import { memo } from "react";

function Field({ label, value, onChange, type = "text", min }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value ?? ""} min={min} onChange={onChange} />
    </label>
  );
}

function InvoiceEditor({ invoice, dispatch }) {
  const setField = (field) => (e) => dispatch({ type: "SET_FIELD", field, value: e.target.value });
  const setParty = (party, field) => (e) =>
    dispatch({ type: "SET_PARTY_FIELD", party, field, value: e.target.value });
  const setItem = (id, field) => (e) => dispatch({ type: "UPDATE_ITEM", id, field, value: e.target.value });

  return (
    <div className="invoice-editor-fields">
      <section className="editor-card">
        <h3>Invoice details</h3>
        <div className="field-grid">
          <Field label="Invoice number" value={invoice.invoiceNumber} onChange={setField("invoiceNumber")} />
          <label className="field">
            <span>Currency</span>
            <select value={invoice.currency} onChange={setField("currency")}>
              {["INR", "USD", "EUR", "GBP"].map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <Field type="date" label="Invoice date" value={invoice.invoiceDate} onChange={setField("invoiceDate")} />
          <Field type="date" label="Due date" value={invoice.dueDate} onChange={setField("dueDate")} />
        </div>
      </section>

      {[
        ["sender", "Your information"],
        ["client", "Client information"],
      ].map(([party, title]) => (
        <section className="editor-card" key={party}>
          <h3>{title}</h3>
          <Field label="Name" value={invoice[party].name} onChange={setParty(party, "name")} />
          <Field label="Email" value={invoice[party].email} onChange={setParty(party, "email")} />
          <label className="field">
            <span>Address</span>
            <textarea value={invoice[party].address} onChange={setParty(party, "address")} />
          </label>
        </section>
      ))}

      <section className="editor-card">
        <div className="card-title-row">
          <h3>Line items</h3>
          <button type="button" onClick={() => dispatch({ type: "ADD_ITEM" })}>
            + Add item
          </button>
        </div>

        {invoice.items.map((item) => (
          <div className="line-item" key={item.id}>
            <Field label="Description" value={item.description} onChange={setItem(item.id, "description")} />
            <Field label="Qty" type="number" min="0" value={item.quantity} onChange={setItem(item.id, "quantity")} />
            <Field label="Rate" type="number" min="0" value={item.rate} onChange={setItem(item.id, "rate")} />
            <button
              type="button"
              className="remove-item"
              onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
            >
              ×
            </button>
          </div>
        ))}
      </section>

      <section className="editor-card">
        <h3>Totals</h3>
        <Field type="number" min="0" label="Tax %" value={invoice.taxRate} onChange={setField("taxRate")} />
        <Field type="number" min="0" label="Discount" value={invoice.discount} onChange={setField("discount")} />
        <label className="field">
          <span>Notes / Terms</span>
          <textarea value={invoice.notes} onChange={setField("notes")} />
        </label>
      </section>
    </div>
  );
}

export default memo(InvoiceEditor);

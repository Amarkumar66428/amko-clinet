import { memo } from "react";

function Field({
  label,
  value,
  onChange,
  type = "text",
  min,
}) {

  return (
    <label className="field">

      <span>{label}</span>

      <input
        type={type}
        value={value ?? ""}
        min={min}
        onChange={onChange}
      />

    </label>
  );
}

function InvoiceEditor({
  invoice,
  dispatch,
}) {

  return (
    <div className="invoice-editor-fields">

      <section className="editor-card">

        <h3>
          Invoice details
        </h3>

        <div className="field-grid">

          <Field
            label="Invoice number"
            value={
              invoice.invoiceNumber
            }
            onChange={event =>
              dispatch({
                type: "SET_FIELD",
                field:
                  "invoiceNumber",
                value:
                  event.target.value,
              })
            }
          />

          <label className="field">

            <span>
              Currency
            </span>

            <select
              value={
                invoice.currency
              }
              onChange={event =>
                dispatch({
                  type:
                    "SET_FIELD",

                  field:
                    "currency",

                  value:
                    event.target.value,
                })
              }
            >
              <option value="INR">
                INR
              </option>

              <option value="USD">
                USD
              </option>

              <option value="EUR">
                EUR
              </option>

              <option value="GBP">
                GBP
              </option>

            </select>

          </label>

          <Field
            type="date"
            label="Invoice date"
            value={
              invoice.invoiceDate
            }
            onChange={event =>
              dispatch({
                type: "SET_FIELD",

                field:
                  "invoiceDate",

                value:
                  event.target.value,
              })
            }
          />

          <Field
            type="date"
            label="Due date"
            value={
              invoice.dueDate
            }
            onChange={event =>
              dispatch({
                type: "SET_FIELD",

                field: "dueDate",

                value:
                  event.target.value,
              })
            }
          />

        </div>

      </section>

      {[
        ["sender", "Your information"],
        ["client", "Client information"],
      ].map(([party, title]) => (

        <section
          className="editor-card"
          key={party}
        >

          <h3>
            {title}
          </h3>

          <Field
            label="Name"
            value={
              invoice[party].name
            }
            onChange={event =>
              dispatch({
                type:
                  "SET_PARTY_FIELD",

                party,

                field: "name",

                value:
                  event.target.value,
              })
            }
          />

          <Field
            label="Email"
            value={
              invoice[party].email
            }
            onChange={event =>
              dispatch({
                type:
                  "SET_PARTY_FIELD",

                party,

                field: "email",

                value:
                  event.target.value,
              })
            }
          />

          <label className="field">

            <span>
              Address
            </span>

            <textarea
              value={
                invoice[party]
                  .address
              }
              onChange={event =>
                dispatch({
                  type:
                    "SET_PARTY_FIELD",

                  party,

                  field:
                    "address",

                  value:
                    event.target.value,
                })
              }
            />

          </label>

        </section>

      ))}

      <section className="editor-card">

        <div className="card-title-row">

          <h3>
            Line items
          </h3>

          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "ADD_ITEM",
              })
            }
          >
            + Add item
          </button>

        </div>

        {invoice.items.map(item => (

          <div
            className="line-item"
            key={item.id}
          >

            <Field
              label="Description"
              value={
                item.description
              }
              onChange={event =>
                dispatch({
                  type:
                    "UPDATE_ITEM",

                  id: item.id,

                  field:
                    "description",

                  value:
                    event.target.value,
                })
              }
            />

            <Field
              label="Qty"
              type="number"
              min="0"
              value={
                item.quantity
              }
              onChange={event =>
                dispatch({
                  type:
                    "UPDATE_ITEM",

                  id: item.id,

                  field:
                    "quantity",

                  value:
                    event.target.value,
                })
              }
            />

            <Field
              label="Rate"
              type="number"
              min="0"
              value={
                item.rate
              }
              onChange={event =>
                dispatch({
                  type:
                    "UPDATE_ITEM",

                  id: item.id,

                  field: "rate",

                  value:
                    event.target.value,
                })
              }
            />

            <button
              type="button"
              className="remove-item"
              onClick={() =>
                dispatch({
                  type:
                    "REMOVE_ITEM",

                  id: item.id,
                })
              }
            >
              ×
            </button>

          </div>

        ))}

      </section>

      <section className="editor-card">

        <h3>
          Totals
        </h3>

        <Field
          type="number"
          min="0"
          label="Tax %"
          value={
            invoice.taxRate
          }
          onChange={event =>
            dispatch({
              type:
                "SET_FIELD",

              field:
                "taxRate",

              value:
                event.target.value,
            })
          }
        />

        <Field
          type="number"
          min="0"
          label="Discount"
          value={
            invoice.discount
          }
          onChange={event =>
            dispatch({
              type:
                "SET_FIELD",

              field:
                "discount",

              value:
                event.target.value,
            })
          }
        />

        <label className="field">

          <span>
            Notes / Terms
          </span>

          <textarea
            value={
              invoice.notes
            }
            onChange={event =>
              dispatch({
                type:
                  "SET_FIELD",

                field: "notes",

                value:
                  event.target.value,
              })
            }
          />

        </label>

      </section>

    </div>
  );
}

export default memo(
  InvoiceEditor
);
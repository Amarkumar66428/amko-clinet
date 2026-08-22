import {
  useMemo,
  useReducer,
} from "react";

function createItem() {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    rate: 0,
  };
}

function createInitialInvoice() {
  return {
    invoiceNumber:
      `INV-${Math.floor(
        1000 + Math.random() * 9000
      )}`,

    invoiceDate:
      new Date()
        .toISOString()
        .slice(0, 10),

    dueDate: "",

    currency: "INR",

    sender: {
      name: "",
      email: "",
      address: "",
    },

    client: {
      name: "",
      email: "",
      address: "",
    },

    items: [
      {
        ...createItem(),
        description: "Website Design",
        rate: 1500,
      },
    ],

    taxRate: 0,

    discount: 0,

    notes: "",
  };
}

function reducer(state, action) {

  switch (action.type) {

    case "SET_FIELD":

      return {
        ...state,
        [action.field]: action.value,
      };


    case "SET_PARTY_FIELD":

      return {
        ...state,

        [action.party]: {
          ...state[action.party],

          [action.field]:
            action.value,
        },
      };


    case "UPDATE_ITEM":

      return {
        ...state,

        items:
          state.items.map(item =>
            item.id === action.id
              ? {
                  ...item,
                  [action.field]:
                    action.value,
                }
              : item
          ),
      };


    case "ADD_ITEM":

      return {
        ...state,

        items: [
          ...state.items,
          createItem(),
        ],
      };


    case "REMOVE_ITEM":

      if (state.items.length === 1) {
        return state;
      }

      return {
        ...state,

        items:
          state.items.filter(
            item =>
              item.id !== action.id
          ),
      };


    default:
      return state;
  }
}

export default function useInvoice() {

  const [invoice, dispatch] =
    useReducer(
      reducer,
      undefined,
      createInitialInvoice
    );

  const totals = useMemo(() => {

    const subtotal =
      invoice.items.reduce(
        (total, item) => {

          const quantity =
            Number(
              item.quantity || 0
            );

          const rate =
            Number(
              item.rate || 0
            );

          return (
            total +
            quantity * rate
          );
        },
        0
      );

    const taxAmount =
      subtotal *
      (Number(
        invoice.taxRate || 0
      ) / 100);

    const total =
      Math.max(
        0,
        subtotal +
          taxAmount -
          Number(
            invoice.discount || 0
          )
      );

    return {
      subtotal,
      taxAmount,
      total,
    };

  }, [invoice]);

  return {
    invoice,
    totals,
    dispatch,
  };
}
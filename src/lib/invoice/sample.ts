import type { Invoice } from "./types";

/** Realistic data used to render template thumbnails. */
export const SAMPLE_INVOICE: Invoice = {
  invoiceNumber: "INV-3621",
  invoiceDate: "2026-08-22",
  dueDate: "2026-09-05",
  currency: "INR",
  sender: {
    name: "Northwind Studio",
    email: "billing@northwind.studio",
    phone: "+91 98765 43210",
    address: "12 MG Road, Bengaluru 560001",
    customFields: [],
  },
  client: {
    name: "Bluebird Retail Pvt. Ltd.",
    email: "accounts@bluebird.in",
    phone: "",
    address: "44 Park Street, Kolkata 700016",
    customFields: [],
  },
  items: [
    { id: "1", description: "Website redesign — discovery & wireframes", quantity: 1, rate: 45000, custom: {} },
    { id: "2", description: "UI design (12 screens)", quantity: 12, rate: 3500, custom: {} },
    { id: "3", description: "Frontend development", quantity: 40, rate: 1800, custom: {} },
    { id: "4", description: "Hosting setup & handover", quantity: 1, rate: 6000, custom: {} },
  ],
  customColumns: [],
  taxLabel: "GST",
  taxRate: 18,
  discount: 5000,
  notes: "Payment due within 14 days. Bank transfer to HDFC Bank, A/C 50100234567890, IFSC HDFC0001234.",
  logo: null,
};

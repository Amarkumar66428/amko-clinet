import type { Metadata } from "next";
import TemplateGallery from "@/components/invoice/TemplateGallery";
import { INVOICE_TEMPLATES } from "@/lib/invoice/templates";

export const metadata: Metadata = {
  title: "Free Invoice Templates | amk",
  description: "Pick a professional invoice template, fill in your details and download a print-ready PDF.",
};

export default function TemplateSelectionPage() {
  return (
    <main className="min-h-screen bg-canvas px-4 pt-7 pb-15 text-ink md:px-[clamp(20px,4vw,64px)] md:pt-12 md:pb-20">
      <TemplateGallery templates={INVOICE_TEMPLATES} />
    </main>
  );
}

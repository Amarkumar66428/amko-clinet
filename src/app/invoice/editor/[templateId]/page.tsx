import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InvoiceWorkspaceLoader from "@/components/invoice/InvoiceWorkspaceLoader";
import { INVOICE_TEMPLATES, getInvoiceTemplate } from "@/lib/invoice/templates";

interface EditorPageProps {
  params: Promise<{ templateId: string }>;
}

// One static page per template; any other id is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return INVOICE_TEMPLATES.map((template) => ({ templateId: template.id }));
}

export async function generateMetadata({ params }: EditorPageProps): Promise<Metadata> {
  const template = getInvoiceTemplate((await params).templateId);
  return { title: template ? `${template.name} Invoice Editor | AMKO` : "Invoice Editor | AMKO" };
}

export default async function InvoiceEditorPage({ params }: EditorPageProps) {
  const template = getInvoiceTemplate((await params).templateId);
  if (!template) notFound();
  return <InvoiceWorkspaceLoader templateId={template.id} />;
}

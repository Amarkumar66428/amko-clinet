"use client";

import dynamic from "next/dynamic";
import type { TemplateId } from "@/lib/invoice/types";

// The workspace reads the saved draft from localStorage while initialising, so it renders on the
// client only; server-rendering it would produce markup that never matches the restored draft.
const InvoiceWorkspace = dynamic(() => import("./InvoiceWorkspace"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-screen place-items-center bg-canvas text-sm text-slate-500" aria-busy="true">
      Loading editor…
    </div>
  ),
});

export default function InvoiceWorkspaceLoader({ templateId }: { templateId: TemplateId }) {
  return <InvoiceWorkspace templateId={templateId} />;
}

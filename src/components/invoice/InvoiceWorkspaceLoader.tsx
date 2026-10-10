"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { loadDraft, type Draft } from "@/lib/invoice/draft";
import type { TemplateId } from "@/lib/invoice/types";

function LoadingEditor() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas text-sm text-slate-500" aria-busy="true">
      Loading editor…
    </div>
  );
}

// The workspace starts from the draft saved in the browser, so it renders on the client only;
// server-rendering it would produce markup that never matches the restored draft.
const InvoiceWorkspace = dynamic(() => import("./InvoiceWorkspace"), { ssr: false, loading: LoadingEditor });

export default function InvoiceWorkspaceLoader({ templateId }: { templateId: TemplateId }) {
  // undefined = still reading IndexedDB; null = no saved draft.
  const [draft, setDraft] = useState<Draft | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    loadDraft().then((loaded) => !cancelled && setDraft(loaded));
    return () => {
      cancelled = true;
    };
  }, []);

  if (draft === undefined) return <LoadingEditor />;
  return <InvoiceWorkspace templateId={templateId} initialDraft={draft} />;
}

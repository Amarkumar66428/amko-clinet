import {
  memo,
  useDeferredValue,
  useMemo,
} from "react";

import {
  buildPreviewDocument,
} from "../features/buildPreviewDocument";

function InvoicePreview({
  template,
  invoice,
  appearance,
}) {

  const deferredInvoice =
    useDeferredValue(invoice);

  const deferredAppearance =
    useDeferredValue(appearance);

  const srcDoc =
    useMemo(
      () =>
        buildPreviewDocument({
          template,
          invoice:
            deferredInvoice,

          appearance:
            deferredAppearance,
        }),
      [
        template,
        deferredInvoice,
        deferredAppearance,
      ]
    );

  return (
    <div className="invoice-preview-shell">

      <iframe
        title="Invoice preview"
        className="invoice-preview-frame"
        srcDoc={srcDoc}
        sandbox=""
      />

    </div>
  );
}

export default memo(
  InvoicePreview
);
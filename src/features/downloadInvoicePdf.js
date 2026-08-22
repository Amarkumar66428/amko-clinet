import toolsService from "../services/toolsService";

export async function generateAndDownloadPdf({
  invoice,
  templateId,
  appearance,
  filename = "invoice.pdf",
}) {
  if (!templateId) {
    throw new Error("templateId is required");
  }

  const response = await toolsService.downloadInvoicePdf({
    invoice,
    templateId,
    appearance,
    filename,
  });

  const data = response?.data ?? response;

  const blob =
    data instanceof Blob
      ? data
      : new Blob([data], {
          type: "application/pdf",
        });

  if (!blob.size) {
    throw new Error("Server returned empty PDF");
  }

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = filename;

  link.style.display = "none";

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

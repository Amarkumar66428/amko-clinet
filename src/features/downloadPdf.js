import toolsService from "../services/toolsService";

export async function generateAndDownloadPdf({
  htmlContent,
  filename = "document.pdf",
}) {
  try {
    const response = await toolsService.downloadPdf({ htmlContent, filename });
    const blob =
      response instanceof Blob
        ? response
        : new Blob([response.data || response], { type: "application/pdf" });

    // Create download URL directly from the Blob
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up DOM and memory
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF Download error:", error);
    throw error;
  }
}

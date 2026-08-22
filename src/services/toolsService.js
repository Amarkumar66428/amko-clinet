import api from "../utils/axios";

const toolsService = {
  getInvoiceTemplates() {
    return api.get("/invoice/templates");
  },

  getInvoiceTemplate(templateId) {
    return api.get(
      `/invoice/templates/${templateId}`
    );
  },

  downloadInvoicePdf(payload) {
    return api.post(
      "/invoice/pdf",
      payload,
      {
        responseType: "blob",
        timeout: 60000,
      }
    );
  },
};

export default toolsService;
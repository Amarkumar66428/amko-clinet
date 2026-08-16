import api from "../utils/axios";

const downloadPdf = async (payload) => {
  const response = await api.post("/tools/pdf_download", payload, {
    responseType: "blob",
  });
  return response.data;
};

const toolsService = { downloadPdf };

export default toolsService;

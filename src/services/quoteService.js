import api from "./api";

export const getQuotes = () => api.get("/quotes").then((res) => res.data);
export const createQuote = (quote) =>
  api.post("/quotes", quote).then((res) => res.data);
export const deleteQuote = (id) =>
  api.delete(`/quotes/${id}`).then((res) => res.data);

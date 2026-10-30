import api from "./api";

export const getStats = () => api.get("/stats").then((res) => res.data);

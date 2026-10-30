import api from "./api";

export const getReviews = () => api.get("/reviews").then((res) => res.data);
export const createReview = (review) =>
  api.post("/reviews", review).then((res) => res.data);
export const deleteReview = (id) =>
  api.delete(`/reviews/${id}`).then((res) => res.data);

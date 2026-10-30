import api from "./api";

export const getBooks = () => api.get("/books").then((res) => res.data);
export const createBook = (book) =>
  api.post("/books", book).then((res) => res.data);
export const updateBook = (id, book) =>
  api.put(`/books/${id}`, book).then((res) => res.data);
export const deleteBook = (id) =>
  api.delete(`/books/${id}`).then((res) => res.data);

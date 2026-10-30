export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const toInputDate = (date) => new Date(date).toISOString().slice(0, 10);

export const getProgress = (book) =>
  book.totalPages
    ? Math.min(100, Math.round((book.pagesRead / book.totalPages) * 100))
    : 0;

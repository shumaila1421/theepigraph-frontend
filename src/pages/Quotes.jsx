import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import { getQuotes, createQuote, deleteQuote } from "../services/quoteService";
import { getBooks } from "../services/bookService";
import { getErrorMessage } from "../services/api";

const initialForm = { text: "", book: "", page: "" };

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);

  useEffect(() => {
    Promise.all([getQuotes(), getBooks()])
      .then(([quotes, books]) => {
        setQuotes(quotes);
        setBooks(books);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setForm(initialForm);
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createQuote({
        text: form.text,
        book: form.book || null,
        page: Number(form.page) || 0,
      });
      setQuotes([created, ...quotes]);
      toast.success("Quote saved");
      setModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteQuote(quoteToDelete._id);
      setQuotes(quotes.filter((q) => q._id !== quoteToDelete._id));
      toast.success("Quote deleted");
      setQuoteToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div>
      <PageHeader
        title="Quotes"
        description="Lines you want to come back to."
        action={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add quote
          </button>
        }
      />

      {loading ? (
        <Loader />
      ) : quotes.length > 0 ? (
        <div className="md:columns-2 md:gap-6">
          {quotes.map((quote) => (
            <blockquote
              key={quote._id}
              className="mb-6 break-inside-avoid rounded-lg border border-line bg-white p-7"
            >
              <span className="block font-serif text-6xl leading-none text-pine/30">
                “
              </span>
              <p className="whitespace-pre-line font-serif text-xl italic leading-relaxed">
                {quote.text}
              </p>
              <footer className="mt-4 text-sm text-muted">
                {quote.book
                  ? `${quote.book.title}, ${quote.book.author}`
                  : "Unknown book"}
                {quote.page > 0 && `, page ${quote.page}`}
                <button
                  className="link-btn ml-4"
                  onClick={() => setQuoteToDelete(quote)}
                >
                  Delete
                </button>
              </footer>
            </blockquote>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No quotes yet"
          message="Save a line from the book you are reading."
          action={
            <button className="btn-primary" onClick={openAdd}>
              Add a quote
            </button>
          }
        />
      )}

      {modalOpen && (
        <Modal title="Add quote" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Quote</label>
              <textarea
                className="input"
                rows="4"
                name="text"
                value={form.text}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
              <div>
                <label className="label">Book (optional)</label>
                <select
                  className="input"
                  name="book"
                  value={form.book}
                  onChange={handleChange}
                >
                  <option value="">No book</option>
                  {books.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Page</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  name="page"
                  value={form.page}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {quoteToDelete && (
        <ConfirmModal
          title="Delete this quote?"
          message="This quote will be removed for good."
          onConfirm={handleDelete}
          onCancel={() => setQuoteToDelete(null)}
        />
      )}
    </div>
  );
}

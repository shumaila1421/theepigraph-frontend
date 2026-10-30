import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../services/journalService";
import { getBooks } from "../services/bookService";
import { getErrorMessage } from "../services/api";
import { moods } from "../constants";
import { formatDate, toInputDate } from "../utils/format";

const initialForm = {
  title: "",
  book: "",
  mood: "Thoughtful",
  entryDate: toInputDate(new Date()),
  content: "",
};

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  useEffect(() => {
    Promise.all([getEntries(), getBooks()])
      .then(([entries, books]) => {
        setEntries(entries);
        setBooks(books);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({ ...initialForm, entryDate: toInputDate(new Date()) });
    setModalOpen(true);
  }

  function openEdit(entry) {
    setEditing(entry);
    setForm({
      title: entry.title,
      book: entry.book?._id || "",
      mood: entry.mood,
      entryDate: toInputDate(entry.entryDate),
      content: entry.content,
    });
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, book: form.book || null };
    try {
      if (editing) {
        const updated = await updateEntry(editing._id, payload);
        setEntries(
          entries.map((en) => (en._id === updated._id ? updated : en)),
        );
        toast.success("Entry updated");
      } else {
        const created = await createEntry(payload);
        setEntries([created, ...entries]);
        toast.success("Entry saved");
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteEntry(entryToDelete._id);
      setEntries(entries.filter((en) => en._id !== entryToDelete._id));
      toast.success("Entry deleted");
      setEntryToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div>
      <PageHeader
        title="Journal"
        description="Write down what a book made you think or feel."
        action={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> New entry
          </button>
        }
      />

      {loading ? (
        <Loader />
      ) : entries.length > 0 ? (
        <div className="divide-y divide-line rounded-lg border border-line bg-white">
          {entries.map((entry) => (
            <article
              key={entry._id}
              className="grid gap-2 p-6 sm:grid-cols-[9rem_1fr] sm:gap-8 sm:p-8"
            >
              <div className="text-sm text-muted">
                <p>{formatDate(entry.entryDate)}</p>
                <p>{entry.mood}</p>
              </div>
              <div>
                <h2 className="text-2xl">{entry.title}</h2>
                {entry.book && (
                  <p className="text-sm text-muted">On {entry.book.title}</p>
                )}
                <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed">
                  {entry.content}
                </p>
                <div className="mt-4 flex gap-4">
                  <button className="link-btn" onClick={() => openEdit(entry)}>
                    Edit
                  </button>
                  <button
                    className="link-btn"
                    onClick={() => setEntryToDelete(entry)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No entries yet"
          message="Your first entry can be a single line about the book you are reading."
          action={
            <button className="btn-primary" onClick={openAdd}>
              Write an entry
            </button>
          }
        />
      )}

      {modalOpen && (
        <Modal
          title={editing ? "Edit entry" : "New entry"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                className="input"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Date</label>
                <input
                  className="input"
                  type="date"
                  name="entryDate"
                  value={form.entryDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Mood</label>
                <select
                  className="input"
                  name="mood"
                  value={form.mood}
                  onChange={handleChange}
                >
                  {moods.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Your thoughts</label>
              <textarea
                className="input"
                rows="6"
                name="content"
                value={form.content}
                onChange={handleChange}
                required
              />
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

      {entryToDelete && (
        <ConfirmModal
          title="Delete this entry?"
          message={`"${entryToDelete.title}" will be removed for good.`}
          onConfirm={handleDelete}
          onCancel={() => setEntryToDelete(null)}
        />
      )}
    </div>
  );
}

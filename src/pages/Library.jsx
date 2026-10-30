import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import BookCover from "../components/BookCover";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/bookService";
import { getErrorMessage } from "../services/api";
import { genres, statuses } from "../constants";
import { getProgress } from "../utils/format";

const initialForm = {
  title: "",
  author: "",
  genre: "Fiction",
  coverUrl: "",
  totalPages: "",
  pagesRead: 0,
  status: "Want to Read",
};

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [genre, setGenre] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = books.filter((book) => {
    const text = `${book.title} ${book.author}`.toLowerCase();
    return (
      text.includes(search.toLowerCase()) &&
      (status === "All" || book.status === status) &&
      (genre === "All" || book.genre === genre)
    );
  });

  function openAdd() {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  }

  function openEdit(book) {
    setEditing(book);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      coverUrl: book.coverUrl,
      totalPages: book.totalPages || "",
      pagesRead: book.pagesRead,
      status: book.status,
    });
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      totalPages: Number(form.totalPages) || 0,
      pagesRead: Number(form.pagesRead) || 0,
    };
    try {
      if (editing) {
        const updated = await updateBook(editing._id, payload);
        setBooks(books.map((b) => (b._id === updated._id ? updated : b)));
        toast.success("Book updated");
      } else {
        const created = await createBook(payload);
        setBooks([created, ...books]);
        toast.success("Book added");
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
      await deleteBook(bookToDelete._id);
      setBooks(books.filter((b) => b._id !== bookToDelete._id));
      toast.success("Book deleted");
      setBookToDelete(null);
      setModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div>
      <PageHeader
        title="Library"
        description="Everything you have read, are reading, or plan to read."
        action={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add book
          </button>
        }
      />

      <div className="mb-8 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            className="input pl-9"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input w-auto"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All statuses</option>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="input w-auto"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="All">All genres</option>
          {genres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-7 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((book) => (
            <div key={book._id} className="group">
              <div className="relative">
                <BookCover
                  book={book}
                  className="transition-shadow group-hover:shadow-lg"
                />
                {/* always visible on phones, shown on hover on bigger screens */}
                <div className="absolute right-2 top-2 flex gap-1.5 opacity-100 transition-opacity md:opacity-0 md:focus-within:opacity-100 md:group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(book)}
                    aria-label={`Edit ${book.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow hover:bg-white"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setBookToDelete(book)}
                    aria-label={`Delete ${book.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-clay shadow hover:bg-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 text-lg leading-snug">{book.title}</h3>
              <p className="text-sm text-muted">{book.author}</p>
              <p className="mt-1 text-xs text-muted">{book.status}</p>
              {book.status === "Currently Reading" && book.totalPages > 0 && (
                <div className="mt-2 h-1 rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-pine"
                    style={{ width: `${getProgress(book)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <EmptyState
          title="No books yet"
          message="Add the book you are reading right now, or one you want to read next."
          action={
            <button className="btn-primary" onClick={openAdd}>
              Add your first book
            </button>
          }
        />
      ) : (
        <EmptyState
          title="No matching books"
          message="Try a different search or clear the filters."
        />
      )}

      {modalOpen && (
        <Modal
          title={editing ? "Edit book" : "Add book"}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Author</label>
                <input
                  className="input"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="label">Genre</label>
                <select
                  className="input"
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                >
                  {genres.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Cover image link (optional)</label>
              <input
                className="input"
                name="coverUrl"
                value={form.coverUrl}
                onChange={handleChange}
                placeholder="https://"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Total pages</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  name="totalPages"
                  value={form.totalPages}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Pages read</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  name="pagesRead"
                  value={form.pagesRead}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3">
              {editing ? (
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setBookToDelete(editing)}
                >
                  Delete book
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-3">
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
            </div>
          </form>
        </Modal>
      )}

      {bookToDelete && (
        <ConfirmModal
          title="Delete this book?"
          message={`"${bookToDelete.title}" and its reviews will be removed. Journal entries and quotes stay, without the book link.`}
          onConfirm={handleDelete}
          onCancel={() => setBookToDelete(null)}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import Stars from "../components/Stars";
import { getReviews, createReview, deleteReview } from "../services/reviewService";
import { getBooks } from "../services/bookService";
import { getErrorMessage } from "../services/api";
import { formatDate } from "../utils/format";

const initialForm = { book: "", rating: 0, text: "" };

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    Promise.all([getReviews(), getBooks()])
      .then(([reviews, books]) => {
        setReviews(reviews);
        setBooks(books);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  // books that do not have a review yet
  const reviewable = books.filter((b) => !reviews.some((r) => r.book?._id === b._id));

  function openAdd() {
    if (reviewable.length === 0) {
      return toast.error(books.length === 0 ? "Add a book to your library first" : "All your books are reviewed");
    }
    setForm(initialForm);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.book) return toast.error("Choose a book to review");
    if (!form.rating) return toast.error("Give a rating");
    setSaving(true);
    try {
      const created = await createReview(form);
      setReviews([created, ...reviews]);
      toast.success("Review saved");
      setModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteReview(reviewToDelete._id);
      setReviews(reviews.filter((r) => r._id !== reviewToDelete._id));
      toast.success("Review deleted");
      setReviewToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="What you honestly thought of the books you finished."
        action={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Write review
          </button>
        }
      />

      {loading ? (
        <Loader />
      ) : reviews.length > 0 ? (
        <div className="divide-y divide-line rounded-lg border border-line bg-white">
          {reviews.map((review) => (
            <article key={review._id} className="p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl">{review.book?.title}</h2>
                <Stars value={review.rating} />
              </div>
              <p className="text-sm text-muted">
                {review.book?.author} · {formatDate(review.createdAt)}
              </p>
              <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed">{review.text}</p>
              <button className="link-btn mt-4" onClick={() => setReviewToDelete(review)}>
                Delete
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No reviews yet"
          message="Review a book once you finish it, so you remember what you thought."
          action={
            <button className="btn-primary" onClick={openAdd}>
              Write a review
            </button>
          }
        />
      )}

      {modalOpen && (
        <Modal title="Write review" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Book</label>
              <select className="input" value={form.book} onChange={(e) => setForm({ ...form, book: e.target.value })}>
                <option value="">Choose a book</option>
                {reviewable.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Rating</label>
              <Stars value={form.rating} size={24} onChange={(n) => setForm({ ...form, rating: n })} />
            </div>
            <div>
              <label className="label">Review</label>
              <textarea
                className="input"
                rows="5"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {reviewToDelete && (
        <ConfirmModal
          title="Delete this review?"
          message={`Your review of "${reviewToDelete.book?.title}" will be removed.`}
          onConfirm={handleDelete}
          onCancel={() => setReviewToDelete(null)}
        />
      )}
    </div>
  );
}

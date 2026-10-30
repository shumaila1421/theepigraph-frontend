import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import BookCover from "../components/BookCover";
import Loader from "../components/Loader";
import { getBooks } from "../services/bookService";
import { getEntries } from "../services/journalService";
import { getQuotes } from "../services/quoteService";
import { getErrorMessage } from "../services/api";
import { formatDate, getProgress } from "../utils/format";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [entries, setEntries] = useState([]);
  const [epigraph, setEpigraph] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBooks(), getEntries(), getQuotes()])
      .then(([books, entries, quotes]) => {
        setBooks(books);
        setEntries(entries);
        // a random saved quote opens the page, like an epigraph opens a book
        if (quotes.length > 0)
          setEpigraph(quotes[Math.floor(Math.random() * quotes.length)]);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const reading = books.filter((b) => b.status === "Currently Reading");
  const upNext = books.filter((b) => b.status === "Want to Read").slice(0, 4);

  return (
    <div>
      <section className="mb-16 border-b border-line pb-14">
        {epigraph ? (
          <blockquote>
            <p className="line-clamp-6 max-w-2xl font-serif text-3xl italic leading-snug sm:text-4xl">
              “{epigraph.text}”
            </p>
            {epigraph.book && (
              <footer className="mt-5 text-sm text-muted">
                {epigraph.book.title}, {epigraph.book.author}
              </footer>
            )}
          </blockquote>
        ) : (
          <div>
            <h1 className="text-4xl tracking-tight sm:text-5xl">
              Welcome back
            </h1>
            <p className="mt-3 max-w-md text-muted">
              Quotes you save will appear here each time you open the app.
            </p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-6 text-2xl">Reading now</h2>
        {reading.length > 0 ? (
          <div className="space-y-8">
            {reading.map((book) => (
              <div
                key={book._id}
                className="flex gap-6 rounded-lg border border-line bg-white p-5 sm:p-6"
              >
                <BookCover book={book} className="w-24 shrink-0 sm:w-28" />
                <div className="flex-1 self-center">
                  <h3 className="text-2xl leading-snug">{book.title}</h3>
                  <p className="text-muted">{book.author}</p>
                  {book.totalPages > 0 && (
                    <div className="mt-5 max-w-sm">
                      <div className="h-1.5 rounded-full bg-line">
                        <div
                          className="h-full rounded-full bg-pine"
                          style={{ width: `${getProgress(book)}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        Page {book.pagesRead} of {book.totalPages} (
                        {getProgress(book)}%)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">
            {books.length === 0
              ? "Your library is empty. "
              : "No book in progress. "}
            <Link
              to="/library"
              className="text-ink underline underline-offset-4"
            >
              {books.length === 0
                ? "Add your first book"
                : "Pick one from your library"}
            </Link>
          </p>
        )}
      </section>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-2xl">Latest journal</h2>
            <Link to="/journal" className="link-btn">
              See all
            </Link>
          </div>
          {entries.length > 0 ? (
            <div className="divide-y divide-line rounded-lg border border-line bg-white">
              {entries.slice(0, 3).map((entry) => (
                <article key={entry._id} className="p-5">
                  <h3 className="text-lg">{entry.title}</h3>
                  <p className="text-xs text-muted">
                    {formatDate(entry.entryDate)}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {entry.content}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No entries yet.</p>
          )}
        </section>

        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-2xl">Up next</h2>
            <Link to="/library" className="link-btn">
              See all
            </Link>
          </div>
          {upNext.length > 0 ? (
            <div className="divide-y divide-line rounded-lg border border-line bg-white">
              {upNext.map((book) => (
                <div key={book._id} className="p-5">
                  <h3 className="text-lg">{book.title}</h3>
                  <p className="text-sm text-muted">{book.author}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">
              Books marked "Want to Read" will show here.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import { getStats } from "../services/statsService";
import { getErrorMessage } from "../services/api";

function Bar({ label, value, max }) {
  return (
    <div className="grid grid-cols-[9rem_1fr_2rem] items-center gap-3 text-sm">
      <span className="truncate text-muted">{label}</span>
      <div className="h-1.5 rounded-full bg-line">
        <div className="h-full rounded-full bg-pine" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
      <span className="text-right">{value}</span>
    </div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!stats) return <p className="text-muted">Statistics could not be loaded.</p>;

  const numbers = [
    ["Books", stats.totalBooks],
    ["Finished", stats.byStatus.Completed],
    ["Pages read", stats.pagesRead.toLocaleString()],
    ["Average rating", stats.reviewCount ? stats.averageRating.toFixed(1) : "-"],
  ];
  const genreList = Object.entries(stats.genres).sort((a, b) => b[1] - a[1]);
  const maxMonth = Math.max(...stats.months.map((m) => m.count), 1);

  return (
    <div>
      <PageHeader title="Stats" description="A summary of your reading so far." />

      <div className="grid grid-cols-2 divide-line rounded-lg border border-line bg-white md:grid-cols-4 md:divide-x">
        {numbers.map(([label, value]) => (
          <div key={label} className="p-6">
            <p className="font-serif text-5xl">{value}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-line bg-white p-6 sm:p-8">
          <h2 className="mb-5 text-2xl">By status</h2>
          <div className="space-y-3">
            {Object.entries(stats.byStatus).map(([name, count]) => (
              <Bar key={name} label={name} value={count} max={stats.totalBooks} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 sm:p-8">
          <h2 className="mb-5 text-2xl">Finished per month</h2>
          <div className="space-y-3">
            {stats.months.map((m) => (
              <Bar key={m.label + m.year} label={`${m.label} ${m.year}`} value={m.count} max={maxMonth} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 sm:p-8">
          <h2 className="mb-5 text-2xl">Genres</h2>
          {genreList.length > 0 ? (
            <div className="space-y-3">
              {genreList.map(([name, count]) => (
                <Bar key={name} label={name} value={count} max={genreList[0][1]} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Add a book to see your genres.</p>
          )}
        </section>

        <section className="rounded-lg border border-line bg-white p-6 sm:p-8">
          <h2 className="mb-5 text-2xl">Writing</h2>
          <p className="text-muted">
            {stats.journalCount} journal {stats.journalCount === 1 ? "entry" : "entries"}, {stats.quoteCount}{" "}
            {stats.quoteCount === 1 ? "quote" : "quotes"} and {stats.reviewCount}{" "}
            {stats.reviewCount === 1 ? "review" : "reviews"}.
          </p>
        </section>
      </div>
    </div>
  );
}

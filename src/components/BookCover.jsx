import { useState } from "react";

const tones = ["bg-[#D8D5CC]", "bg-[#C9D3CF]", "bg-[#D6CFC8]", "bg-[#C9D0D8]", "bg-[#D3CDD6]"];

export default function BookCover({ book, className = "" }) {
  const [failed, setFailed] = useState(false);
  const tone = tones[book.title.length % tones.length];

  return (
    <div className={`relative aspect-[2/3] overflow-hidden rounded-[3px] shadow-md shadow-ink/15 ${className}`}>
      {book.coverUrl && !failed ? (
        <img
          src={book.coverUrl}
          alt={`${book.title} cover`}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        // no cover image, so draw a simple framed cover
        <div className={`h-full w-full p-2 ${tone}`}>
          <div className="flex h-full flex-col justify-between border border-ink/20 p-3">
            <span className="font-serif text-base leading-tight">{book.title}</span>
            <span className="text-xs text-ink/60">{book.author}</span>
          </div>
        </div>
      )}
      {/* spine shadow on the left edge */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent" />
    </div>
  );
}

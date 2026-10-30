import { Star } from "lucide-react";

// pass onChange to make it clickable
export default function Stars({ value, onChange, size = 16 }) {
  return (
    <div className="flex gap-0.5 text-pine" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Star size={size} strokeWidth={1.5} fill={n <= value ? "currentColor" : "none"} />;
        if (!onChange) return <span key={n}>{star}</span>;
        return (
          <button type="button" key={n} onClick={() => onChange(n)} aria-label={`${n} star`}>
            {star}
          </button>
        );
      })}
    </div>
  );
}

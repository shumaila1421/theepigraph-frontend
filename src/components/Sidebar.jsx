import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { House, LibraryBig, NotebookPen, Quote, Star, ChartNoAxesColumn, X } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/library", label: "Library", icon: LibraryBig },
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/quotes", label: "Quotes", icon: Quote },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/stats", label: "Stats", icon: ChartNoAxesColumn },
];

export default function Sidebar({ open, onClose }) {
  // close the mobile menu with Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink/50 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-night px-5 py-8 text-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-12 flex items-start justify-between px-3">
          <div>
            <p className="font-serif text-2xl tracking-tight">The Epigraph</p>
            <p className="mt-1 font-serif text-sm italic text-white/50">a reading journal</p>
          </div>
          <button onClick={onClose} aria-label="Close menu" className="text-white/60 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        <p className="mt-auto border-t border-white/10 px-3 pt-5 text-xs text-white/40">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </aside>
    </>
  );
}

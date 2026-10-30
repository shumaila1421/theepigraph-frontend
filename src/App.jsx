import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Journal from "./pages/Journal";
import Quotes from "./pages/Quotes";
import Reviews from "./pages/Reviews";
import Stats from "./pages/Stats";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#23262B",
            color: "#F6F6F3",
            fontSize: "14px",
            borderRadius: "6px",
          },
          success: { iconTheme: { primary: "#A9C2BC", secondary: "#23262B" } },
          error: { iconTheme: { primary: "#D4A0A0", secondary: "#23262B" } },
        }}
      />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="font-serif text-xl">The Epigraph</span>
        </header>

        <main className="mx-auto max-w-4xl px-5 pb-24 pt-10 sm:px-10 lg:pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

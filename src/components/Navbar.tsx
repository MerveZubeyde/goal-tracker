"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import MotivationModal from "./MotivationModal";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const router = useRouter();
  const pathname = usePathname();

  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  useEffect(() => {
    document.body.style.overflow = modalOpen || menuOpen ? "hidden" : "";
    if (!menuOpen && menuButtonRef.current) {
      menuButtonRef.current.focus();
    }
  }, [modalOpen, menuOpen]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await auth.signOut();
      router.push("/");
      setMenuOpen(false);
      setSigningOut(false);
    } catch (error) {
      setSigningOut(false);
    }
  };

  const handleLogoClick = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {[
        { href: "/add-goal", label: "Add New Goal" },
        { href: "/achieved-goals", label: "Achieved Goals" },
        { href: "/ongoing-goals", label: "Ongoing Goals" },
        { href: "/profile", label: "Profile" },
      ].map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={onClick}
          className={`block px-2 py-1 rounded-md text-md font-medium transition-colors duration-300 ${
            pathname === href
              ? "text-[var(--color-accent)] bg-[var(--color-primary)]"
              : "text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-primary)]"
          }`}
          aria-current={pathname === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </>
  );

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-[var(--color-secondary)] shadow-md"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogoClick}
              className="font-extrabold text-3xl sm:text-4xl text-[var(--color-accent)] tracking-wide hover-soft-glow"
              aria-haspopup="dialog"
              aria-expanded={modalOpen}
              aria-controls="motivation-modal"
              aria-label="Show motivation quotes"
              tabIndex={0}
            >
              Goal Tracker
            </button>
            {user && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-transparent transition duration-300 text-[var(--color-primary)] hover:text-[var(--color-accent)]"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                tabIndex={0}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="flex items-center space-x-2 text-[var(--color-text)]" aria-live="polite">
                <div className="w-5 h-5 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                <span>Loading...</span>
              </div>
            ) : !user ? (
              <>
                <Link
                  href="/signin"
                  className="text-xl font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] transition px-2 py-1"
                  aria-label="Sign In"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-xl font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] transition px-2 py-1"
                  aria-label="Sign Up"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <NavLinks />
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="relative px-2 py-1 text-md font-medium transition-all duration-300 text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50"
                  aria-label="Sign Out"
                  tabIndex={0}
                >
                  {signingOut ? "Signing Out..." : "Sign Out"}
                </button>
              </>
            )}
          </div>
          <button
            className="md:hidden text-[var(--color-primary)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            ref={menuButtonRef}
            tabIndex={0}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-[var(--color-secondary)] border-t border-[var(--color-primary)] px-4 py-3 space-y-2 shadow-lg"
            role="menu"
            aria-label="Mobile navigation"
          >
            {loading ? (
              <p className="text-center text-[var(--color-primary)] text-sm font-medium" aria-live="polite">
                Loading...
              </p>
            ) : !user ? (
              <>
                <Link
                  href="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-primary)] transition-colors duration-200"
                  aria-label="Sign In"
                  role="menuitem"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-primary)] transition-colors duration-200"
                  aria-label="Sign Up"
                  role="menuitem"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <NavLinks onClick={() => setMenuOpen(false)} />
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-primary)] transition-colors duration-200"
                  aria-label="Sign Out"
                  role="menuitem"
                  tabIndex={0}
                >
                  {signingOut ? "Signing Out..." : "Sign Out"}
                </button>
              </>
            )}
          </div>
        )}
      </nav>
      {modalOpen && (
        <MotivationModal
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

import { useContext, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link, NavLink as RouterLink } from "react-router-dom";
import useClickOutside from "../utilities/useClickOutside";
import { CiLogin } from "react-icons/ci";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { AuthContext } from "../AuthContext";

export default function Header({ activeScreen, setActiveScreen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);

  const ClickOutRef = useRef(null);
  useClickOutside(ClickOutRef, () => setMenuOpen(false));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-bg-border bg-bg-main">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-bold text-3xl">
            Curr<span className="text-primary">Compare</span>
          </div>

          <nav className="flex items-center gap-1">
            <HeaderLink label="Dashboard" to="/dashboard" />
            <HeaderLink label="Historic" to="/historic" />
            <HeaderLink label="Corss Rates" to="/crossrates" />
          </nav>
        </div>
        <div ref={ClickOutRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-bg-lighter transition"
          >
            <CgProfile
              className={`text-3xl ${menuOpen ? "text-primary" : ""}`}
            />
            <span className="text-xl font-semibold">Sign in {auth?.username}</span>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 min-w-54
              bg-bg-lighter divide-y divide-bg-lighter3/20
              border border-bg-border rounded-xl shadow-lg p-1 space-y-1"
            >
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-3 text-lg hover:bg-bg-lighter2 rounded-xl"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-primary text-2xl">
                  <CiLogin />
                </span>
                Log In
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 px-4 py-3 text-lg hover:bg-bg-lighter2 rounded-xl"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-primary text-2xl">
                  <MdOutlinePersonAddAlt />
                </span>
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
  function HeaderLink({ label, to }) {
    return (
      <RouterLink
        to={to}
        className={({ isActive }) => `
          px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all
          ${
            isActive
              ? "text-primary bg-primary/10"
              : "text-txt-dark hover:text-txt-main hover:bg-bg-lighter"
          }
        `}
      >
        {label}
      </RouterLink>
    );
  }
}

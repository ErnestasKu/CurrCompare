import { CgProfile } from "react-icons/cg";
import { NavLink as RouterLink } from "react-router-dom";

export default function Header({ activeScreen, setActiveScreen }) {
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
            <HeaderLink label="Profile" to="/profile" />
          </nav>
        </div>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-bg-lighter transition">
          <CgProfile className="text-3xl" />
          <span className="text-xl font-semibold"> Sign in</span>
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

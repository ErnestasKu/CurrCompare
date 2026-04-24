import { useContext, useRef, useState } from "react";
import { Link, NavLink as RouterLink } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

export default function Header({ activeScreen, setActiveScreen }) {
  const handleLogout = () => {
    setAuth(null);
    setMenuOpen(false);
    navigate("/dashboard");
  };

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
        <ProfileMenu />
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

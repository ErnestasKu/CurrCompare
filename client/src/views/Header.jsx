import { CgProfile } from "react-icons/cg";

export default function Header({ activeScreen, setActiveScreen }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-bg-border bg-bg-main">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-bold text-3xl">
            Curr<span className="text-primary">Compare</span>
          </div>

          <nav className="flex items-center gap-1">
            <NavLink label="Dashboard" screenCode={"DASHBOARD"} />
            <NavLink label="Historic" screenCode={"HISTORIC"} />
            <NavLink label="Profile" screenCode={"PROFILE"} />
          </nav>
        </div>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-bg-lighter transition">
          <CgProfile className="text-3xl" />
          <span className="text-xl font-semibold"> Sign in</span>
        </div>
      </div>
    </header>
  );
  function NavLink({ label, screenCode }) {
    return (
      <button
        onClick={() => setActiveScreen(screenCode)}
        className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all
        ${
          screenCode === activeScreen
            ? "text-primary bg-primary/10"
            : "text-txt-dark hover:text-txt-main hover:bg-bg-lighter"
        }`}
      >
        {label}
      </button>
    );
  }
}

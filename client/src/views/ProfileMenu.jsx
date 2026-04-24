import { useContext, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link, NavLink as RouterLink, useNavigate } from "react-router-dom";
import useClickOutside from "../utilities/useClickOutside";
import { CiLogin, CiLogout } from "react-icons/ci";
import { MdOutlineAccountCircle, MdOutlinePersonAddAlt } from "react-icons/md";
import { AuthContext } from "../AuthContext";
import authService from "../services/authenticationService";

export default function ProfileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const ClickOutRef = useRef(null);
  useClickOutside(ClickOutRef, () => setMenuOpen(false));

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setAuth(null);
      setMenuOpen(false);
      navigate("/dashboard");
    }
  };

  const menuClass =
    "flex items-center gap-2 px-4 py-3 text-lg hover:bg-bg-lighter2 rounded-xl w-full hover:text-primary hover:bg-primary/10";

  return (
    <div ref={ClickOutRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-bg-lighter outline-0  outline-bg-lighter transition ${
          menuOpen ? "outline-2" : ""
        }`}
      >
        <span className="text-lg font-semibold">
          {auth?.username ? auth.username : "Sign in"}
        </span>
        <CgProfile className="text-3xl text-primary" />
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 mt-2 min-w-54
              bg-bg-lighter divide-y divide-bg-lighter3/20
              border border-bg-border rounded-xl shadow-lg p-1 space-y-1"
        >
          {auth?.token ? (
            <>
              <Link
                to={`/profile/${auth.id}`}
                className={menuClass}
                onClick={() => setMenuOpen(false)}
              >
                <MdOutlineAccountCircle className="text-2xl text-primary" />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className={`${menuClass} text-red-400 hover:bg-red-400/10 hover:text-red-400`}
              >
                <CiLogout className="text-2xl" />
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={menuClass}
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-primary text-2xl">
                  <CiLogin />
                </span>
                Log In
              </Link>
              <Link
                to="/signup"
                className={menuClass}
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-primary text-2xl">
                  <MdOutlinePersonAddAlt />
                </span>
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

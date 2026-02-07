import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Coins } from "lucide-react";

export default function Navbar(): React.ReactElement {
  const username = localStorage.getItem("name");
  const { user } = useUser();
  const points = user?.points || 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("points");
    localStorage.removeItem("userId");
    // quick hack to update navbar
     window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-20 bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white font-bold text-xl tracking-wide">
            ⚡ EV HUB
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-white/90">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-emerald-400 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/partners"
              className="hover:text-emerald-400 transition-colors"
            >
              Partners
            </Link>
            <Link
              to="/contact"
              className="hover:text-emerald-400 transition-colors"
            >
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Auth Links */}
        <div className="flex items-center gap-4 text-white/90">
          {username ? (
            <>
              {/* Points Display */}
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-2 rounded-lg border border-green-500">
                <Coins size={18} className="text-green-400" />
                <span className="font-semibold text-green-400">{points} Points</span>
              </div>
              <span className="font-semibold text-emerald-400">{username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 rounded text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="hover:text-emerald-400 transition-colors"
              >
                SignUp
              </Link>
              <span>|</span>
              <Link
                to="/login"
                className="hover:text-emerald-400 transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

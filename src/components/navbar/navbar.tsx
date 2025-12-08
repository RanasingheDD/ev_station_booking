import React from 'react';
import { Link,useNavigate  } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LogoutButton from '../logout/LogoutButton';

export default function Navbar(): React.ReactElement {
   const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login", { replace: true });
    window.location.reload(); // quick hack to update navbar
  };
  

  return (
    <header className="fixed top-0 left-0 w-full z-20 bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white font-bold text-xl tracking-wide">
            LOGO
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-white/90">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-emerald-400 transition-colors">
              About Us
            </Link>
            <Link to="/partners" className="hover:text-emerald-400 transition-colors">
              Partners
            </Link>
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Auth Links */}
        <div className="flex items-center gap-4 text-white/90">
  {username ? (
    <>
      <span className="font-semibold text-emerald-400">
        {username}
      </span>
      <button
            onClick={handleLogout}
            className="px-2 py-1 bg-red-600 rounded text-white"
          >
            Logout
          </button>
    </>
  ) : (
    <>
      <Link to="/signup" className="hover:text-emerald-400 transition-colors">
        SignUp
      </Link>
      <span>|</span>
      <Link to="/login" className="hover:text-emerald-400 transition-colors">
        Login
      </Link>
    </>
  )}
</div>
      </div>
    </header>
  );
}

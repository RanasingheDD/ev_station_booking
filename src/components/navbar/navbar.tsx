import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(): React.ReactElement {
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
          <Link to="/signup" className="hover:text-emerald-400 transition-colors">
            SignUp
          </Link>
          <span>|</span>
          <Link to="/login" className="hover:text-emerald-400 transition-colors">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}

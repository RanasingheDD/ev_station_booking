// HeroLanding.tsx
// React + TypeScript + Tailwind component (Hero section with background image and text overlay)

import React from 'react';
import {Link} from 'react-router-dom';
import hero from '../../assets/hero.png'; // Make sure to place your hero image here

export default function HeroLanding(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
     
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <img
          src={hero}
          alt="EV Charging Station"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-emerald-900/60 mix-blend-multiply" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-300 leading-tight mb-8">
            The World biggest EV <br /> Charging booking platform
          </h1>
          <button className="px-10 py-4 text-lg font-semibold bg-emerald-400 text-gray-900 rounded-full hover:bg-emerald-300 transition-transform transform hover:scale-105 shadow-xl">
            Join with Us
          </button>
           <Link to="/dashboard"><button className="px-10 py-4 text-lg font-semibold bg-emerald-400 text-gray-900 rounded-full hover:bg-emerald-300 transition-transform transform hover:scale-105 shadow-xl">
            Dashboard
          </button></Link>
        </div>
      </section>
    </div>
  );
}

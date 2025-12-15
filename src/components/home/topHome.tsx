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
            The World biggest EVs <br /> Charging booking platform
          </h1>
          <div className="flex gap-6 justify-center mt-8">
            <Link to="/signup">
            <button className="px-10 py-4 text-lg font-semibold bg-emerald-400 text-gray-900 rounded-full hover:bg-emerald-300 transition-transform transform hover:scale-105 shadow-xl">
              Join with Us
            </button>
            </Link>
            <Link to="/dashboard">
              <button className="px-10 py-4 text-lg font-semibold bg-emerald-400 text-gray-900 rounded-full hover:bg-emerald-300 transition-transform transform hover:scale-105 shadow-xl">
               Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// import React, { useState } from "react";

// // Using a sample video URL for demonstration
// // Replace with your actual video path: "/videos/hero.mp4"
// const heroVideo = "/videos/hero.mp4";
// import { Link } from "react-router-dom";

// export default function HeroLanding() {
//   const [videoError, setVideoError] = useState(false);

//   return (
//     <div className="min-h-screen text-white relative overflow-hidden">
//       {/* Video Background */}
//       {!videoError ? (
//         <video
//           className="absolute top-0 left-0 w-full h-full object-cover z-0"
//           src={heroVideo}
//           autoPlay
//           loop
//           muted
//           playsInline
//           onError={() => setVideoError(true)}
//         />
//       ) : (
//         // Fallback gradient background if video fails
//         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 z-0"></div>
//       )}
      
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-emerald-900/40 z-10"></div>
      
//       {/* Hero Content */}
//       <div className="relative z-20 flex flex-col items-center justify-center h-screen text-center px-6">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-300 leading-tight mb-8 drop-shadow-2xl">
//           The World's Biggest EVs <br /> Charging Booking Platform
//         </h1>
//         <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
//           <Link to="/signup">
//           <button className="px-10 py-4 text-lg font-semibold bg-emerald-400 text-gray-900 rounded-full hover:bg-emerald-300 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
//             Join With Us
//           </button>
//           </Link>
//           <Link to="/dashboard">
//           <button className="px-10 py-4 text-lg font-semibold bg-transparent text-emerald-300 border-2 border-emerald-400 rounded-full hover:bg-emerald-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-xl">
//             Dashboard
//           </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
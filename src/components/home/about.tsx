import React from "react";

export default function about(): React.ReactElement {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-300 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-5xl font-bold text-green-400 mb-4">⚡ About EV HUB</h1>
        <p className="text-gray-400 max-w-2xl">
          Empowering a sustainable future through intelligent and connected electric vehicle solutions.
        </p>
      </section>

      {/* About Content */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-semibold text-green-400">Who We Are</h2>
          <p className="text-gray-400 leading-relaxed">
            <span className="text-green-400 font-semibold">EV HUB</span> is an innovative platform built to make electric vehicle charging simple,
            fast, and accessible. Our goal is to connect EV owners with efficient charging solutions
            that are both eco-friendly and user-focused.
          </p>
          <p className="text-gray-400 leading-relaxed">
            We integrate cutting-edge technologies like IoT, AI, and data-driven systems to enhance
            the charging experience and optimize energy usage. Our team is dedicated to accelerating
            the shift toward a cleaner and more connected future.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold text-green-400">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            To accelerate the adoption of electric vehicles by providing smart and reliable
            digital solutions that empower users and promote sustainable mobility worldwide.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold text-green-400">Our Vision</h2>
          <p className="text-gray-400 leading-relaxed">
            To build a fully connected EV ecosystem where technology, energy, and innovation
            work together for a cleaner planet.
          </p>
        </div>
      </section>

     
      
    </div>
  );
}

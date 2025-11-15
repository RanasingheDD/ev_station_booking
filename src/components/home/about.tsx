import React from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import coverImg from "../../assets/about/ImageWithFallback.png";
import memberImg from "../../assets/about/member.jpg";
import { TeamMember } from "../../components/teamMembers/teamMembers"; 

export default function About(): React.ReactElement {
  const teamMembers = [
    {
      name: "Ruwan Perera",
      imageUrl: memberImg,
      bio: "Driving innovation to simplify EV charging and create a connected, sustainable future."
    },
    {
      name: "Nisha Fernando",
      imageUrl: memberImg,
      bio: "Leading IoT and data-driven solutions for smart and efficient EV charging systems."
    },
    {
      name: "Dilan Silva",
      imageUrl: memberImg,
      bio: "Designing intuitive and eco-friendly experiences for EV owners worldwide."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50">

        {/* Hero Section */}
        <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src={coverImg}
            alt="EV HUB Smart Charging"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 text-center text-white px-4 max-w-3xl">
            <h1 className="text-green-300 mb-4 text-5xl font-bold drop-shadow-lg">About EV HUB</h1>
            <p className="text-white/90 text-lg leading-relaxed">
              Empowering a sustainable future through intelligent and connected electric vehicle solutions.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-green-500 text-3xl font-semibold mb-10">Who We Are</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              EV HUB is an innovative platform built to make electric vehicle charging simple, fast, and accessible.
              Our goal is to connect EV owners with efficient charging solutions that are both eco-friendly and user-focused.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We integrate cutting-edge technologies like IoT, AI, and data-driven systems to enhance the charging experience
              and optimize energy usage. Our team is dedicated to accelerating the shift toward a cleaner and more connected future.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-24 px-4 bg-white/60 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-green-500 text-3xl font-semibold mb-8">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
              To accelerate the adoption of electric vehicles by providing smart and reliable digital solutions that empower users and promote sustainable mobility worldwide.
            </p>
            <h2 className="text-green-500 text-3xl font-semibold mb-8">Our Vision</h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
              To build a fully connected EV ecosystem where technology, energy, and innovation work together for a cleaner planet.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-green-500 mb-6 text-3xl font-semibold">Meet Our Team</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              The passionate individuals driving EV HUB forward
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {teamMembers.map((member) => (
                <TeamMember
                  name={member.name}
                  imageUrl={member.imageUrl}
                  bio={member.bio}
                />
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}

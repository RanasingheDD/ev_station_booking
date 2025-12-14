import React from "react";
import Navbar from "../navbar/navbar";
import coverImg from "../../assets/about/ImageWithFallback.png";
import memberImg from "../../assets/about/member.jpg";
import { TeamMember } from "../../components/teamMembers/teamMembers"; 
import { Briefcase, Lightbulb, Zap } from 'lucide-react';

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
      
      <div className="min-h-screen bg-white font-sans overflow-x-hidden">
        <section className="relative w-screen left-1/2 -translate-x-1/2 h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={coverImg}
                    alt="EV HUB Smart Charging"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="relative z-10 text-center px-8 py-12 max-w-4xl mx-4 
                          bg-black/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
                
                <p className="text-green-400 font-bold tracking-widest uppercase text-sm mb-4">
                    About EV HUB
                </p>
                
                <h1 className="text-white mb-6 text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
                    Charging the <span className="text-green-400">Electric Future</span>
                </h1>
                
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
                    Empowering a sustainable future through intelligent and connected electric vehicle solutions.
                </p>
            </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <Zap className="w-12 h-12 text-green-600 mx-auto mb-6" />
            <h2 className="text-gray-900 text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
              EV HUB is an innovative platform built to make electric vehicle charging simple, fast, and accessible. 
              Our goal is to connect EV owners with efficient charging solutions that are both eco-friendly and user-focused.
            </p>

            <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-green-50 p-8 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-green-700 mb-3">Smart Integration</h3>
                    <p className="text-gray-700">
                        We integrate cutting-edge technologies like IoT, AI, and data-driven systems to enhance the charging experience.
                    </p>
                </div>
                <div className="bg-green-50 p-8 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-green-700 mb-3">Sustainability First</h3>
                    <p className="text-gray-700">
                         Our team is dedicated to optimizing energy usage and accelerating the shift toward a cleaner, more connected future.
                    </p>
                </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gradient-to-b from-white to-green-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-gray-900 text-3xl md:text-4xl font-bold mb-16">Our Core Pillars</h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="flex flex-col items-center text-center p-10 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500 group">
                <div className="bg-green-100 p-4 rounded-full mb-6 group-hover:bg-green-500 transition-colors duration-300">
                    <Briefcase className="w-8 h-8 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To accelerate the adoption of electric vehicles by providing smart and reliable digital solutions that empower users and promote sustainable mobility worldwide.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-10 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500 group">
                <div className="bg-green-100 p-4 rounded-full mb-6 group-hover:bg-green-500 transition-colors duration-300">
                    <Lightbulb className="w-8 h-8 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To build a fully connected EV ecosystem where technology, energy, and innovation work together for a cleaner planet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-gray-900 text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                The passionate individuals driving EV HUB forward
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMember
                  key={index}
                  name={member.name}
                  imageUrl={member.imageUrl}
                  bio={member.bio}
                />
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
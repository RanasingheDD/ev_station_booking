import { useState } from "react";

// Replace with your actual video path
const sectionVideo = "/videos/hero.mp4";

export default function VideoWithStorySection() {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="w-full py-16 px-6 md:px-12 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-400">
            What’s Happening With Us
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We are building a smart EV charging booking and payment ecosystem that
            connects drivers with charging stations across the country. Our
            platform focuses on convenience, speed, and reliability.
          </p>
          <p className="text-gray-400 leading-relaxed">
            With real-time availability, mobile app integration, and secure
            payments, users can easily book charging slots, manage sessions, and
            stay powered wherever they go.
          </p>
        </div>

        {/* Right Video */}
        <div className="relative w-full h-[260px] md:h-[360px] rounded-2xl overflow-hidden shadow-2xl">
          {!videoError ? (
            <video
              className="w-full h-full object-cover"
              src={sectionVideo}
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center">
              <span className="text-emerald-300 font-semibold">
                Video unavailable
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

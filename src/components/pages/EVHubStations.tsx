import React from "react";
import { useEffect, useState } from "react";
import { MapPin, Search, Battery, Zap, Clock, TrendingUp } from "lucide-react";
import EVMap from "./EVMap";
import useAuth from "../hooks/useAuth";


const Stations: React.FC = () => {
  useAuth();
  const [place, setPlace] = useState("Detecting location...");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Reverse Geocoding API (OpenStreetMap free)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${"6.053254644587544"}&lon=${"80.50530092142688"}`
        );
        
        const data = await res.json();

        // const city =
        //   data.address.city ||
        //   data.address.town ||
        //   data.address.village ||
        //   data.address.state_district;

        // const country = data.address.country;

        setPlace(`${data.display_name}`);
      },
      () => {
        setPlace("Location permission denied");
      }
    );
  }, []);


  return (
    <div className="flex-1 bg-[#0B0F19] text-gray-200 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-sm text-gray-400">Pages / Stations</h2>
          <h1 className="text-2xl font-bold text-white">Stations</h1>
        </div>

        <div className="flex items-center bg-[#111827] rounded-lg px-3 py-2 w-64">
          <Search className="text-gray-400 mr-2 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none text-gray-300 w-full"
          />
        </div>
      </div>

      
      {/* Location Map Section */}
      <div className="bg-[#101726] rounded-2xl p-6 mb-8">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <MapPin className="text-green-400 w-5 h-5" /> {place}
        </h3>

        <div className="bg-[#161B2E] rounded-xl h-98 overflow-hidden">
          <EVMap />
        </div>
      </div>


      {/* Station Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Tesla Station */}
        <div className="bg-[#161B2E] p-5 rounded-xl border border-green-400/40 hover:border-green-400 transition">
          <p className="text-gray-400 text-sm mb-1">1.5 miles</p>
          <h3 className="text-white text-lg font-semibold mb-2">Tesla Station</h3>
          <div className="flex justify-between text-sm mb-3">
            <p>Type: <span className="text-green-400">DC</span></p>
            <p>Price: <span className="text-green-400">$0.6/kW</span></p>
          </div>
          <p className="text-gray-400 text-sm">Slot Available: 5</p>
        </div>

        {/* Super Charger */}
        <div className="bg-[#161B2E] p-5 rounded-xl border border-transparent hover:border-green-400 transition">
          <p className="text-gray-400 text-sm mb-1">2.3 miles</p>
          <h3 className="text-white text-lg font-semibold mb-2">Super Charger</h3>
          <div className="flex justify-between text-sm mb-3">
            <p>Type: <span className="text-green-400">DC</span></p>
            <p>Price: <span className="text-green-400">$0.8/kW</span></p>
          </div>
          <p className="text-gray-400 text-sm">Slot Available: 9</p>
        </div>

        {/* Shell Station */}
        <div className="bg-[#161B2E] p-5 rounded-xl border border-transparent hover:border-green-400 transition">
          <p className="text-gray-400 text-sm mb-1">3.1 miles</p>
          <h3 className="text-white text-lg font-semibold mb-2">Shell Station</h3>
          <div className="flex justify-between text-sm mb-3">
            <p>Type: <span className="text-green-400">DC</span></p>
            <p>Price: <span className="text-green-400">$1.3/kW</span></p>
          </div>
          <p className="text-gray-400 text-sm">Slot Available: 4</p>
        </div>
      </div>

      {/* Vehicle Stats Panel */}
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#101726] p-6 rounded-2xl">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            Vehicle Stats
          </h3>

          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">EV</p>
              <p className="text-white font-semibold">Tesla</p>

              <p className="text-gray-400 text-sm">Battery</p>
              <p className="text-green-400 font-semibold flex items-center gap-1">
                <Battery className="w-4 h-4" /> 80%
              </p>

              <p className="text-gray-400 text-sm">Range</p>
              <p className="text-white font-semibold">340 miles</p>

              <p className="text-gray-400 text-sm">Temp</p>
              <p className="text-white font-semibold">75.2°F</p>
            </div>

            <img
              src="/car01.png"
              alt="Tesla"
              className="w-56 h-auto rounded-xl object-cover"
            />
          </div>
        </div>

        <div className="bg-[#161B2E] p-6 rounded-2xl">
          <h4 className="text-white font-semibold mb-2">Performance</h4>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Battery Status:</p>
            <p className="text-green-400 flex items-center gap-1">
              <Zap className="w-4 h-4" /> Good
            </p>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Activity Time:</p>
            <p className="text-white text-sm">1:24 h</p>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Time Left:</p>
            <p className="text-white text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" /> 4:56 h
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Avg Energy:</p>
            <p className="text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> 67 kW
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stations;

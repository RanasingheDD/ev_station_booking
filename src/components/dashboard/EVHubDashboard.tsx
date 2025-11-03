import React from "react";
import { Battery, Car, Zap, Clock, Settings, MapPin, Power } from "lucide-react";

const EVHubDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0E1424] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-green-400 font-bold text-2xl mb-10">⚡ EV HUB</h1>
          <ul className="space-y-6">
            <li className="text-green-400 font-semibold cursor-pointer">Dashboard</li>
            <li className="hover:text-green-400 cursor-pointer">Stations</li>
            <li className="hover:text-green-400 cursor-pointer">My Trips</li>
            <li className="hover:text-green-400 cursor-pointer">Account</li>
            <li className="hover:text-green-400 cursor-pointer">Subscription</li>
          </ul>
        </div>

        <div>
          <h2 className="text-gray-400 text-sm mb-4">My Cars</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#161B2E] p-3 rounded-lg">
              <div>
                <h3 className="text-white font-semibold">Tesla Model Y</h3>
                <p className="text-xs text-gray-400">85% | 260 miles</p>
              </div>
              <Car className="text-green-400" />
            </div>
            <div className="flex items-center justify-between bg-[#161B2E] p-3 rounded-lg">
              <div>
                <h3 className="text-white font-semibold">Nissan Leaf</h3>
                <p className="text-xs text-gray-400">76% | 210 miles</p>
              </div>
              <Car className="text-green-400" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Vehicle Details</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            + Add New
          </button>
        </div>

        <div className="bg-[#101726] p-6 rounded-2xl flex justify-between">
          {/* Vehicle Section */}
          <div className="w-2/3">
            <img
              src="/car01.png"
              alt="Tesla Model Y"
              className="rounded-xl w-full object-cover"
            />
            <h3 className="text-white text-xl font-semibold mt-4">Tesla Model Y</h3>

            <div className="flex justify-between mt-4 text-gray-400">
              <div>
                <p className="text-sm">Speed</p>
                <p className="text-white font-semibold">360 km/h</p>
              </div>
              <div>
                <p className="text-sm">Engine</p>
                <p className="text-white font-semibold">E765</p>
              </div>
              <div>
                <p className="text-sm">Maintenance</p>
                <p className="text-white font-semibold">Every 1 mo</p>
              </div>
              <div>
                <p className="text-sm">Audio System</p>
                <p className="text-white font-semibold">Premium</p>
              </div>
            </div>
          </div>

          {/* Available Slots Section */}
          <div className="w-1/3 pl-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Available Slots</h3>
              <button className="text-green-400 text-sm hover:underline">See all</button>
            </div>

            <div className="bg-[#161B2E] p-4 rounded-xl mb-4">
              <p className="text-gray-400 text-sm mb-1">A1 - EV 085</p>
              <h4 className="text-lg text-white font-bold mb-2">4 SLOTS</h4>
              <div className="flex items-center justify-between">
                <p className="text-green-400 text-sm">Available</p>
                <Power className="text-green-400" />
              </div>
            </div>

            <div className="bg-[#161B2E] p-4 rounded-xl">
              <p className="text-gray-400 text-sm mb-1">A3 - EV 093</p>
              <h4 className="text-lg text-white font-bold mb-2">4 SLOTS</h4>
              <div className="flex items-center justify-between">
                <p className="text-green-400 text-sm">Available</p>
                <Power className="text-green-400" />
              </div>
            </div>

            {/* Booking History */}
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-3">Booking History</h3>
              <div className="bg-[#161B2E] p-4 rounded-xl mb-2">
                <p className="text-gray-400 text-sm mb-1">A1 - EV 085</p>
                <p className="text-white text-sm">25/05 | Completed</p>
              </div>
              <div className="bg-[#161B2E] p-4 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">A3 - EV 093</p>
                <p className="text-white text-sm">28/05 | Charging</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EVHubDashboard;

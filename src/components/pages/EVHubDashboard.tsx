import React, { useState } from "react";
import { X } from "lucide-react";

const EVHubDashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  // EV Form State
  const [evName, setEvName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [battery, setBattery] = useState("");
  const [speed, setSpeed] = useState("");

  const handleAddEV = (e: React.FormEvent) => {
    e.preventDefault();

    const newEV = {
      evName,
      regNo,
      battery,
      speed
    };

    console.log("New EV Added:", newEV);

    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 flex">

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Vehicle Details</h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Add New
          </button>
        </div>

        {/* ------- Modal Overlay ------- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#101726] p-8 rounded-2xl w-full max-w-md shadow-lg relative border border-[#1A2236] animate-fadeIn">

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                <X size={22} />
              </button>

              <h3 className="text-xl text-white font-semibold mb-6">
                Add New EV
              </h3>

              {/* EV Form */}
              <form onSubmit={handleAddEV} className="space-y-4">

                <div>
                  <label className="text-sm text-gray-300">EV Name</label>
                  <input
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white outline-none border border-[#1A2236]"
                    placeholder="Tesla Model Y"
                    value={evName}
                    onChange={(e) => setEvName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Registration No</label>
                  <input
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white outline-none border border-[#1A2236]"
                    placeholder="ABC-1234"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Battery Capacity</label>
                  <input
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white outline-none border border-[#1A2236]"
                    placeholder="75 kWh"
                    value={battery}
                    onChange={(e) => setBattery(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Max Speed</label>
                  <input
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white outline-none border border-[#1A2236]"
                    placeholder="250 km/h"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                  >
                    Save EV
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------- Existing Dashboard UI ------- */}
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
            {/* Remaining dashboard content... */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EVHubDashboard;

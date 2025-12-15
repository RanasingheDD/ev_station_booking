import React, { useState } from "react";
import { X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const EVHubDashboard: React.FC = () => {
  useAuth();
  // const navigate = useNavigate();
  //const [showModal, setShowModal] = useState(false);

  // EV Form State
  // const [evName, setEvName] = useState("");
  // const [regNo, setRegNo] = useState("");
  // const [battery, setBattery] = useState("");
  // const [speed, setSpeed] = useState("");

  //   React.useEffect(() => {
  //   const verifySession = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       return navigate("/login");
  //     }

  //     try {
  //       const response = await fetch("http://localhost:8080/api/auth/check", {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       });

  //       if (response.status === 401) {
  //         localStorage.removeItem("token");
  //         alert("Session expired. Please log in again.");
  //         navigate("/login");
  //       }
  //     } catch (error) {
  //       console.error("Failed to verify session", error);
  //       localStorage.removeItem("token");
  //       navigate("/login");
  //     }
  //   };

  //   verifySession();
  // }, []);

  // Modal OPEN/CLOSE state
  const [showModal, setShowModal] = useState(false);

  // Old EV fields (required for your newEV object)
  const [evName, setEvName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [battery, setBattery] = useState("");
  const [speed, setSpeed] = useState("");

  // New EV fields
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [batteryKWh, setBatteryKWh] = useState("");
  const [maxChargeKw, setMaxChargeKw] = useState("");
  const [connectorTypes, setConnectorTypes] = useState("");
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [nickname, setNickname] = useState("");
  const [color, setColor] = useState("");
  const [mileage, setMileage] = useState("");

  const handleAddEV = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEV = {
      evName,
      regNo,
      battery,
      speed,
      make,
      model,
      year,
      maxChargeKw,
      vin,
      nickname,
      color,
      mileage,
    };

    console.log("New EV Added:", newEV);

    try {
      const response = await fetch("http://localhost:8080/api/evs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEV),
      });

      if (!response.ok) {
        throw new Error("Failed to add EV");
      }

      const data = await response.json();
      console.log("EV saved to database:", data);

      // Close modal
      setShowModal(false);

      // OPTIONAL: clear input fields
      // setEvName(""); setRegNo(""); ...
    } catch (error) {
      console.error("Error saving EV:", error);
    }
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="bg-[#101726] p-6 rounded-2xl w-full max-w-md shadow-lg relative
                      border border-[#1A2236] animate-fadeIn
                      max-h-[90vh] overflow-y-auto
                      scrollbar-thin scrollbar-track-[#101726] scrollbar-thumb-[#1A2236]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>

              <h3 className="text-xl text-white font-semibold mb-2">
                Add New EV
              </h3>

              {/* EV Form */}
              <form
                onSubmit={handleAddEV}
                className="space-y-1 w-full max-w-sm mx-auto"
              >
                <div>
                  <label className="text-sm text-gray-300">Make</label>
                  <input
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white border border-[#1A2236]"
                    placeholder="Audi"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Model</label>
                  <input
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white border border-[#1A2236]"
                    placeholder="e-tron GT"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Year</label>
                  <input
                    type="number"
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white border border-[#1A2236]"
                    placeholder="2020"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">
                    Max Charge (kW)
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white border border-[#1A2236]"
                    placeholder="10"
                    value={maxChargeKw}
                    onChange={(e) => setMaxChargeKw(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">VIN</label>
                  <input
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white border border-[#1A2236]"
                    placeholder="1254"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Nickname</label>
                  <input
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white border border-[#1A2236]"
                    placeholder="My Car"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Color</label>
                  <input
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white border border-[#1A2236]"
                    placeholder="Black"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Mileage (km)</label>
                  <input
                    type="number"
                    className="w-full mt-1 bg-[#0B0F19] p-3 rounded-lg text-white border border-[#1A2236]"
                    placeholder="12000"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-2">
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
            <h3 className="text-white text-xl font-semibold mt-4">
              Tesla Model Y
            </h3>

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

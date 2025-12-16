import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { loadEVs, addEV,type EV } from "../../services/ev_service";

const EVHubDashboard: React.FC = () => {
  useAuth(); // Verify authentication

  // States
  const [evs, setEvs] = useState<EV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // New EV form states
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [maxChargeKw, setMaxChargeKw] = useState("");
  const [batteryKwh, setBatteryKwh] = useState("");
  const [connectorTypes, setConnectorTypes] = useState("");
  const [nickname, setNickname] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  // Load EVs on component mount
  useEffect(() => {
    const fetchEVs = async () => {
      try {
        const data = await loadEVs();
        setEvs(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load vehicles");
      } finally {
        setLoading(false);
      }
    };
    fetchEVs();
  }, []);

  // Handle adding new EV
  const handleAddEV = async (e: React.FormEvent) => {
    e.preventDefault();
    

    const newEV: Omit<EV, "id"> = {
      make,
      model,
      year: Number(year),
      batteryKwh: Number(batteryKwh),
      maxChargeKw: Number(maxChargeKw),
      connectorTypes: connectorTypes.split(",").map((c) => c.trim()),
      nickname,
      licensePlate,
    };

    const savedEV = await addEV(newEV);
    if (savedEV) {
      setEvs((prev) => [...prev, savedEV]);
      setShowModal(false);
      // Reset form
      setMake("");
      setModel("");
      setYear("");
      setBatteryKwh("");
      setMaxChargeKw("");
      setConnectorTypes("");
      setNickname("");
      setLicensePlate("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 flex ml-64">
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Vehicle Details</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Add New
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#101726] p-6 rounded-2xl w-full max-w-md shadow-lg relative border border-[#1A2236] max-h-[90vh] overflow-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
              <h3 className="text-xl text-white font-semibold mb-4">
                Add New EV
              </h3>
              <form onSubmit={handleAddEV} className="space-y-3">
                <input
                  placeholder="Make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-[#0B0F19] p-3 rounded-lg border border-[#1A2236] text-white"
                />
                <input
                  placeholder="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#0B0F19] p-3 rounded-lg border border-[#1A2236] text-white"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#0B0F19] p-3 rounded-lg border border-[#1A2236] text-white"
                />
                <input
                  type="number"
                  placeholder="Battery kWh"
                  value={batteryKwh}
                  onChange={(e) => setBatteryKwh(e.target.value)}
                  className="w-full bg-[#0B0F19] p-3 rounded-lg border border-[#1A2236] text-white"
                />
                <input
                  type="number"
                  placeholder="Max Charge (kW)"
                  value={maxChargeKw}
                  onChange={(e) => setMaxChargeKw(e.target.value)}
                  className="w-full bg-[#0B0F19] p-3 rounded-lg border border-[#1A2236] text-white"
                />
                <input
                  placeholder="Connector Types (comma-separated)"
                  value={connectorTypes}
                  onChange={(e) => setConnectorTypes(e.target.value)}
                  className="w-full bg-[#0B0F19] p-3 rounded-lg border border-[#1A2236] text-white"
                />
                <input
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-[#0B0F19] p-3 rounded-lg border border-[#1A2236] text-white"
                />
                <input
                  placeholder="License Plate"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full bg-[#0B0F19] p-3 rounded-lg border border-[#1A2236] text-white"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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

        {/* Vehicle List - Full Width */}
        <div className="flex flex-col gap-10">
          {loading && <p>Loading vehicles...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading &&
            !error &&
            evs.map((ev) => (
              <div
                key={ev.id}
                className="bg-[#101726] rounded-2xl w-full max-w-6xl mx-auto shadow-xl overflow-hidden"
              >
                <img
                  src="/car01.png"
                  alt={ev.nickname || ev.make}
                  className="w-full h-96 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-white text-3xl font-bold">
                    {ev.nickname || `${ev.make} ${ev.model}`}
                  </h3>
                  <div className="flex justify-between mt-6 text-gray-400">
                    <div>
                      <p className="text-sm">Model</p>
                      <p className="text-white font-semibold">{ev.model}</p>
                    </div>
                    <div>
                      <p className="text-sm">Year</p>
                      <p className="text-white font-semibold">{ev.year}</p>
                    </div>
                    <div>
                      <p className="text-sm">Battery</p>
                      <p className="text-white font-semibold">{ev.batteryKwh} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm">Max Charge</p>
                      <p className="text-white font-semibold">{ev.maxChargeKw} kW</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default EVHubDashboard;
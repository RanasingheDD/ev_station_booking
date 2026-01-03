import { useEffect, useState } from "react";
import { Calendar, Clock, Car, Zap } from "lucide-react";
import { loadEVs, type EV } from "../../services/ev_service";

const durations = [30, 60, 90, 120, 180];

const BookingScreen = () => {
  const [evs, setEvs] = useState<EV[]>([]);
  const [selectedEvId, setSelectedEvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEVs = async () => {
      try {
        const data = await loadEVs();

        if (Array.isArray(data)) {
          setEvs(data);
        } else {
          setEvs([]);
        }
      } catch (err) {
        console.error("Failed to load EVs", err);
        setError("Unable to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchEVs();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-5 ml-64 space-y-6">

      {/* HEADER */}
      <div className="bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h1 className="text-green-400 text-xl font-bold">Book Charger</h1>
        <p className="text-gray-400 text-sm">
          Select vehicle, time and duration
        </p>
      </div>

      {/* VEHICLE SELECTION */}
      <div className="bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
          <Car size={18} /> Select Vehicle
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-gray-400 text-sm">Loading vehicles...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Empty */}
        {!loading && evs.length === 0 && !error && (
          <p className="text-gray-400 text-sm">No vehicles found</p>
        )}

        {/* EV LIST */}
        <div className="space-y-3">
          {evs.map((ev) => (
            <label
              key={ev.id}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer
                ${
                  selectedEvId === ev.id
                    ? "border-green-500"
                    : "border-[#1A2236]"
                }
                hover:border-green-500`}
            >
              <div>
                <p className="font-medium">
                  {ev.make} {ev.model} ({ev.year})
                </p>

                <p className="text-sm text-gray-400">
                  {ev.batteryKwh} kWh •{" "}
                  {ev.connectorTypes?.join(", ") ?? "Unknown connector"}
                </p>

                <p className="text-xs text-gray-500">
                  {ev.nickname ?? "My Vehicle"} •{" "}
                  {ev.licensePlate ?? "N/A"}
                </p>
              </div>

              <input
                type="radio"
                name="vehicle"
                checked={selectedEvId === ev.id}
                onChange={() => setSelectedEvId(ev.id)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* TIME SELECTION */}
      <div className="bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
          <Clock size={18} /> Charging Time
        </h2>

        <div className="flex gap-3 mb-4">
          <button className="flex-1 py-3 rounded-lg bg-green-500 text-white font-semibold">
            Charge Now
          </button>
          <button className="flex-1 py-3 rounded-lg border border-[#1A2236] text-gray-300">
            Schedule
          </button>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-sm text-gray-400">Date</label>
            <input
              type="date"
              className="w-full mt-1 bg-[#0B0F19] border border-[#1A2236] rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex-1">
            <label className="text-sm text-gray-400">Time</label>
            <input
              type="time"
              className="w-full mt-1 bg-[#0B0F19] border border-[#1A2236] rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* DURATION */}
      <div className="bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
          <Zap size={18} /> Duration
        </h2>

        <div className="flex flex-wrap gap-3">
          {durations.map((m) => (
            <button
              key={m}
              className="px-4 py-2 rounded-lg border border-[#1A2236] hover:border-green-500"
            >
              {m} min
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-40 bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3">
          Booking Summary
        </h2>

        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Start</span>
          <span>Today, 10:30 AM</span>
        </div>

        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>End</span>
          <span>Today, 11:30 AM</span>
        </div>

        <div className="flex justify-between font-semibold text-lg mt-3">
          <span>Total</span>
          <span className="text-green-400">Rs. 1,200.00</span>
        </div>
      </div>

      {/* BOTTOM ACTION */}
      <div className="fixed ml-64 bottom-0 left-0 right-0 bg-[#0E1424] border-t border-[#1A2236] p-5">
        <button
          disabled={!selectedEvId}
          className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2
            ${
              selectedEvId
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-600 cursor-not-allowed"
            }`}
        >
          <Calendar size={20} /> Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingScreen;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Car, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { loadEVs, type EV } from "../../services/ev_service";
import { checkAvailability, createBooking } from "../../services/booking_service";

const durations = [30, 60, 90, 120, 180];

const BookingScreen = () => {
  const { stationId, chargerId } = useParams<{ stationId: string; chargerId: string }>();
  const navigate = useNavigate();

  const [evs, setEvs] = useState<EV[]>([]);
  const [selectedEvId, setSelectedEvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking details
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState<string>("10:00");
  const [duration, setDuration] = useState<number>(30);

  // Availability state
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMsg, setAvailabilityMsg] = useState<string>("");

  useEffect(() => {
    const fetchEVs = async () => {
      try {
        const data = await loadEVs();
        if (Array.isArray(data)) {
          setEvs(data);
          if (data.length > 0) setSelectedEvId(data[0].id);
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

  // Check availability whenever time/date/duration changes
  useEffect(() => {
    if (!stationId || !chargerId || !date || !time) return;

    const check = async () => {
      setChecking(true);
      setAvailabilityMsg("");
      setIsAvailable(null);

      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      const res = await checkAvailability(
        stationId,
        chargerId,
        startDateTime.toISOString(),
        endDateTime.toISOString()
      );

      setIsAvailable(res.available);
      if (!res.available) {
        setAvailabilityMsg(res.message || "Time slot unavailable");
      }
      setChecking(false);
    };

    const timer = setTimeout(check, 500); // Debounce
    return () => clearTimeout(timer);
  }, [date, time, duration, stationId, chargerId]);

  const handleConfirmBooking = async () => {
    if (!stationId || !chargerId || !selectedEvId || !isAvailable) return;

    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const res = await createBooking({
      stationId,
      chargerId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      userId: 'current-user-id', // In real app, get from auth context
      totalAmount: (duration / 60) * 15 // Example pricing
    });

    if (res.success) {
      alert("Booking Confirmed! ID: " + res.bookingId);
      navigate('/owner-dashboard'); // Or wherever appropriate
    } else {
      alert("Booking Failed: " + res.message);
    }
  };

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
                ${selectedEvId === ev.id
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

        {/* Date and Time Inputs */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-sm text-gray-400">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 bg-[#0B0F19] border border-[#1A2236] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex-1">
            <label className="text-sm text-gray-400">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full mt-1 bg-[#0B0F19] border border-[#1A2236] rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Availability Status */}
        <div className="mt-4">
          {checking && <p className="text-yellow-400 text-sm">Checking availability...</p>}
          {!checking && isAvailable === true && (
            <p className="text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16} /> Slot Available</p>
          )}
          {!checking && isAvailable === false && (
            <p className="text-red-400 text-sm flex items-center gap-2"><AlertCircle size={16} /> {availabilityMsg}</p>
          )}
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
              onClick={() => setDuration(m)}
              className={`px-4 py-2 rounded-lg border 
                ${duration === m ? "border-green-500 bg-green-500/10 text-green-400" : "border-[#1A2236] text-gray-400"}
                hover:border-green-500 transition-colors`}
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
          <span>{date}, {time}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>End</span>
          <span>
            {(() => {
              const d = new Date(`${date}T${time}`);
              if (isNaN(d.getTime())) return "Invalid Date";
              d.setMinutes(d.getMinutes() + duration);
              return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            })()}
          </span>
        </div>

        <div className="flex justify-between font-semibold text-lg mt-3">
          <span>Total Estimate</span>
          <span className="text-green-400">Rs. {((duration / 60) * 1200).toFixed(2)}</span>
        </div>
      </div>

      {/* BOTTOM ACTION */}
      <div className="fixed ml-64 bottom-0 left-0 right-0 bg-[#0E1424] border-t border-[#1A2236] p-5">
        <button
          onClick={handleConfirmBooking}
          disabled={!selectedEvId || !isAvailable || checking}
          className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all
            ${(selectedEvId && isAvailable && !checking)
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-700 cursor-not-allowed text-gray-400"
            }`}
        >
          <Calendar size={20} />
          {checking ? "Checking..." : isAvailable === false ? "Slot Unavailable" : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default BookingScreen;

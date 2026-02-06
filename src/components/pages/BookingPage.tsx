import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Car, Zap, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { loadEVs, type EV } from "../../services/ev_service";
import { checkAvailability } from "../../services/booking_service";

const durations = [30, 60, 90, 120, 180];

interface CheckoutResponse {
  url: string;
}

const BookingScreen = () => {
  const navigate = useNavigate();
  const { stationId, chargerId } = useParams<{ stationId: string; chargerId: string }>();

  // EV Selection
  const [evs, setEvs] = useState<EV[]>([]);
  const [selectedEvId, setSelectedEvId] = useState<string | null>(null);

  // Booking Details
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("10:30");
  const [duration, setDuration] = useState(60);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMsg, setAvailabilityMsg] = useState<string>("");

  // Load EVs on component mount
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
        setError("Unable to load vehicles");
        console.error(err);
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

      try {
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
      } catch (err) {
        console.error("Availability check error:", err);
      } finally {
        setChecking(false);
      }
    };

    const timer = setTimeout(check, 500); // Debounce
    return () => clearTimeout(timer);
  }, [date, time, duration, stationId, chargerId]);

  // Handle payment & booking
  const handleConfirmBooking = async () => {
    if (!selectedEvId || !stationId || !chargerId) {
      alert("Please select a vehicle and ensure station/charger IDs are present!");
      return;
    }

    if (!isAvailable) {
      alert("This time slot is not available!");
      return;
    }

    setProcessing(true);

    try {
      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      const payload = {
        evId: selectedEvId,
        stationId: stationId,
        chargerId: chargerId,
        startAt: startDateTime.toISOString(),
        endAt: endDateTime.toISOString(),
      };

      const token = localStorage.getItem('token');
      const response = await axios.post<CheckoutResponse>(
        'http://localhost:8080/api/bookings/checkout',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert("Booking created! Redirecting...");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Unable to process booking. Please check if all IDs exist.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white p-5 ml-64 flex items-center justify-center">
        <p>Loading vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white p-5 ml-64 flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-5 ml-64 space-y-6">
      {/* HEADER */}
      <div className="bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h1 className="text-green-400 text-xl font-bold">Book Charger</h1>
        <p className="text-gray-400 text-sm">Select vehicle, time, and duration</p>
      </div>

      {/* VEHICLE SELECTION */}
      <div className="bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
          <Car size={18} /> Select Vehicle
        </h2>
        <div className="space-y-3">
          {evs.map((ev) => (
            <label
              key={ev.id}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all
                ${selectedEvId === ev.id
                  ? "border-green-500 bg-green-500/5"
                  : "border-[#1A2236] hover:border-green-500"
                }`}
            >
              <div>
                <p className="font-medium">{ev.make} {ev.model} ({ev.year})</p>
                <p className="text-sm text-gray-400">
                  {ev.batteryKwh} kWh • {ev.connectorTypes?.join(", ") ?? "Unknown"}
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
            <p className="text-green-400 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Slot Available
            </p>
          )}
          {!checking && isAvailable === false && (
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {availabilityMsg}
            </p>
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
              className={`px-4 py-2 rounded-lg border transition-all
                ${duration === m
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-[#1A2236] text-gray-400 hover:border-green-500"
                }`}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-40 bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3">Booking Summary</h2>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Start</span>
            <span className="text-white">{date}, {time}</span>
          </div>
          <div className="flex justify-between">
            <span>End</span>
            <span className="text-white">
              {(() => {
                const d = new Date(`${date}T${time}`);
                if (isNaN(d.getTime())) return "Invalid";
                d.setMinutes(d.getMinutes() + duration);
                return d.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
              })()}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-3 border-t border-[#1A2236] pt-3">
            <span>Total Estimate</span>
            <span className="text-green-400">Rs. {((duration / 60) * 1200).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION */}
      <div className="fixed ml-64 bottom-0 left-0 right-0 bg-[#0E1424] border-t border-[#1A2236] p-5">
        <button
          onClick={handleConfirmBooking}
          disabled={!selectedEvId || !isAvailable || checking || processing}
          className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all
            ${(selectedEvId && isAvailable && !checking && !processing)
              ? "bg-green-500 hover:bg-green-600 active:scale-95"
              : "bg-gray-700 cursor-not-allowed text-gray-400"
            }`}
        >
          {processing && (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Processing...
            </>
          )}
          {!processing && checking && "Checking Availability..."}
          {!processing && !checking && isAvailable === false && "Slot Unavailable"}
          {!processing && !checking && isAvailable !== false && (
            <>
              <Calendar size={20} />
              Confirm & Pay
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingScreen;
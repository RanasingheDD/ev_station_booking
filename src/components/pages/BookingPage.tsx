import { useEffect, useState } from "react";
import { Calendar, Clock, Car, Zap } from "lucide-react";
import { loadEVs, type EV } from "../../services/ev_service";
import axios from 'axios';
import { useParams } from "react-router-dom";

const durations = [30, 60, 90, 120, 180];

interface CheckoutResponse {
  url: string;
}

const BookingScreen = () => {
  const [evs, setEvs] = useState<EV[]>([]);
  const [selectedEvId, setSelectedEvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { stationId, chargerId } = useParams<{ stationId: string; chargerId: string }>();

  // --- NEW STATE FOR BOOKING DETAILS ---
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState("10:30");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [stationName] = useState("EV Station 1"); // Placeholder or from props

  useEffect(() => {
    const fetchEVs = async () => {
      try {
        const data = await loadEVs();
        if (Array.isArray(data)) setEvs(data);
      } catch (err) {
        setError("Unable to load vehicles");
      } finally {
        setLoading(false);
      }
    };
    fetchEVs();
  }, []);


  const handleConfirmPayment = async () => {
    if (!selectedEvId) {
      alert("Please select a vehicle!");
      return;
    }

    setIsLoading(true);

    // Calculate timing as we did before
    const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const endDateTime = new Date(startDateTime.getTime() + selectedDuration * 60000);

    const payload = {
      evId: selectedEvId,
      stationId: stationId, // Dynamically pulled from URL (e.g., "station-001")
      chargerId: chargerId, // Dynamically pulled from URL (e.g., "ch-001")
      startAt: startDateTime.toISOString(),
      endAt: endDateTime.toISOString(),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<CheckoutResponse>(
        'http://localhost:8080/api/bookings/checkout', 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Unable to process booking. Check if IDs exist in Database.");
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-5 ml-64 space-y-6">
      {/* HEADER */}
      <div className="bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h1 className="text-green-400 text-xl font-bold">Book Charger</h1>
        <p className="text-gray-400 text-sm">Select vehicle, time and duration</p>
      </div>

      {/* VEHICLE SELECTION */}
      <div className="bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
          <Car size={18} /> Select Vehicle
        </h2>
        <div className="space-y-3">
          {evs.map((ev) => (
            <label key={ev.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${selectedEvId === ev.id ? "border-green-500 bg-green-500/5" : "border-[#1A2236]"}`}>
              <div>
                <p className="font-medium">{ev.make} {ev.model}</p>
                <p className="text-sm text-gray-400">{ev.licensePlate || "No Plate"}</p>
              </div>
              <input type="radio" name="vehicle" checked={selectedEvId === ev.id} onChange={() => setSelectedEvId(ev.id)} />
            </label>
          ))}
        </div>
      </div>

      {/* TIME SELECTION */}
      <div className="bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
          <Clock size={18} /> Charging Time
        </h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-sm text-gray-400">Date</label>
            <input
              type="date"
              className="w-full mt-1 bg-[#0B0F19] border border-[#1A2236] rounded-lg px-3 py-2"
              title="Select date for scheduled charging"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-400">Time</label>
            <input
              type="time"
              className="w-full mt-1 bg-[#0B0F19] border border-[#1A2236] rounded-lg px-3 py-2"
              title="Select time for scheduled charging"
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
            <button key={m} onClick={() => setSelectedDuration(m)} className={`px-4 py-2 rounded-lg border transition-all ${selectedDuration === m ? "bg-green-500 border-green-500 text-white" : "border-[#1A2236] text-gray-400 hover:border-green-500"}`}>
              {m} min
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-40 bg-[#0E1424] p-5 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3">Booking Summary</h2>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between"><span>Station</span><span className="text-white">{stationName}</span></div>
          <div className="flex justify-between"><span>Start</span><span className="text-white">{selectedDate}, {selectedTime}</span></div>
          <div className="flex justify-between font-semibold text-lg mt-3 border-t border-[#1A2236] pt-3">
            <span>Total</span><span className="text-green-400">Rs. 1,200.00</span>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION */}
      <div className="fixed ml-64 bottom-0 left-0 right-0 bg-[#0E1424] border-t border-[#1A2236] p-5">
        <button
          onClick={handleConfirmPayment}
          disabled={!selectedEvId || isLoading}
          className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all ${selectedEvId && !isLoading ? "bg-green-500 hover:bg-green-600 active:scale-[0.98]" : "bg-gray-600 cursor-not-allowed"}`}
        >
          {isLoading ? <><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> Processing...</> : "Confirm Payment"}
          {!isLoading && <Calendar size={20} />}
        </button>
      </div>
    </div>
  );
};

export default BookingScreen;
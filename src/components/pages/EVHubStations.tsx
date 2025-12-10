import React, { useEffect, useState } from "react";
import { MapPin, Search, Battery, Zap, Clock, TrendingUp } from "lucide-react";
import EVMap from "./EVMap";
import useAuth from "../hooks/useAuth";
import useLocation from "../hooks/useLocation";
import { useNavigate } from "react-router-dom";
import {
  fetchStations,
  type DisplayStation,
} from "../../services/station_service";

const Stations: React.FC = () => {
  useAuth();
  const place = useLocation();
  const navigate = useNavigate();

  const [stations, setStations] = useState<DisplayStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStations = async () => {
      const data = await fetchStations();
      setStations(data);
      setLoading(false);
    };
    loadStations();
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

      {/* Map */}
      <div className="bg-[#101726] rounded-2xl p-6 mb-8">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
<<<<<<< Updated upstream
          <MapPin className="text-green-400 w-5 h-5" /> {!place}
=======
          <MapPin className="text-green-400 w-5 h-5" /> {place.place}
>>>>>>> Stashed changes
        </h3>

        <div className="bg-[#161B2E] rounded-xl h-98 overflow-hidden">
          <EVMap />
        </div>
      </div>

      {/* Station Cards */}
      <div className="grid grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-400">Loading stations...</p>
        ) : stations.length === 0 ? (
          <p className="text-gray-400">No stations found.</p>
        ) : (
          stations.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/stations/${s.id}`)}
              className="cursor-pointer bg-[#161B2E] p-5 rounded-xl border 
                         border-transparent hover:border-green-400 hover:shadow-lg 
                         transition"
            >
              <p className="text-gray-400 text-sm mb-1">{s.distance} miles</p>

              <h3 className="text-white text-lg font-semibold mb-2">
                {s.name}
              </h3>

              <div className="flex justify-between text-sm mb-3">
                <p>
                  Type: <span className="text-green-400">{s.type}</span>
                </p>
                <p>
                  Price: <span className="text-green-400">${s.price}/kW</span>
                </p>
              </div>

              <p className="text-gray-400 text-sm">Slot Available: {s.slot}</p>
            </div>
          ))
        )}
      </div>

      {/* Vehicle Stats Panel */}
      {/* (your existing vehicle panel code here...) */}
    </div>
  );
};

export default Stations;

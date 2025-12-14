import React, { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import EVMap from "./EVMap";
import useAuth from "../hooks/useAuth";
import useLocation from "../hooks/useLocation";
import { useNavigate } from "react-router-dom";
import {
  fetchStations,
  searchStations,
  type DisplayStation,
} from "../../services/station_service";

const Stations: React.FC = () => {
  useAuth();
  const place = useLocation();
  const navigate = useNavigate();

  const [stations, setStations] = useState<DisplayStation[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DisplayStation[]>([]);
  const [searching, setSearching] = useState(false);

  // 🔍 Load stations & search (single source)
  useEffect(() => {
    const loadStations = async () => {
      setLoading(true);
      setSearching(query.trim().length >= 2);

      try {
        if (query.trim().length >= 2) {
          const data = await searchStations(query);
          setStations(data);
          setSearchResults(data);
        } else {
          const data = await fetchStations();
          setStations(data);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error loading stations", error);
      } finally {
        setLoading(false);
        setSearching(false);
      }
    };

    const debounce = setTimeout(loadStations, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="flex-1 bg-[#0B0F19] text-gray-200 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-sm text-gray-400">Pages / Stations</h2>
          <h1 className="text-2xl font-bold text-white">Stations</h1>
        </div>

        {/* 🔍 Search Bar */}
        <div className="relative w-64">
          <div className="flex items-center bg-[#111827] rounded-lg px-3 py-2">
            <Search className="text-gray-400 mr-2 w-4 h-4" />
            <input
              type="text"
              placeholder="Search station"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent focus:outline-none text-gray-300 w-full"
            />
          </div>

          {/* 🔽 Dropdown Results */}
          {query.trim().length >= 2 && (
            <div className="absolute top-11 left-0 right-0 bg-[#0E1424] 
                            border border-[#1A2236] rounded-lg 
                            max-h-60 overflow-y-auto z-50">

              {searching && (
                <p className="px-4 py-2 text-sm text-gray-400">
                  Searching...
                </p>
              )}

              {!searching && searchResults.length === 0 && (
                <p className="px-4 py-2 text-sm text-gray-400">
                  No stations found
                </p>
              )}

              {searchResults.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/stations/${s.id}`)}
                  className="px-4 py-2 hover:bg-[#1A2236] cursor-pointer"
                >
                  <p className="text-white text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-gray-400">
                    {s.slot} slots • {s.type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="bg-[#101726] rounded-2xl p-6 mb-8">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <MapPin className="text-green-400 w-5 h-5" /> {place.place}
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
              <p className="text-gray-400 text-sm mb-1">
                {s.distance} miles
              </p>

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

              <p className="text-gray-400 text-sm">
                Slot Available: {s.slot}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Stations;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  Calendar,
  Navigation,
  Coffee,
  Wifi,
  ParkingCircle,
  Building2,
} from "lucide-react";

import { getStationById } from "../../services/station_service";
import type { Station, Charger, TariffRule } from "../../models/station_model";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={16} />,
  restroom: <Building2 size={16} />,
  cafe: <Coffee size={16} />,
  restaurant: <Coffee size={16} />,
  parking: <ParkingCircle size={16} />,
};

const StationDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStation();
  }, []);

  const loadStation = async () => {
    try {
      if (!id) return;
      const data = await getStationById(id);
      setStation(data);
    } catch (err) {
      console.error("Error loading station:", err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F19]">
        <div className="animate-spin h-10 w-10 border-2 rounded-full border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="bg-[#0E1424] p-10 rounded-2xl border border-[#1A2236] text-center">
          <h1 className="text-green-400 font-bold text-2xl mb-4">
            Station not found
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const availableChargers =
    station.chargers?.filter((c) => c.status === "Available") || [];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-5 space-y-5">
      {/* Header */}
      <div className="bg-[#0E1424] p-6 rounded-2xl border border-[#1A2236] space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-green-400 font-bold text-xl">{station.name}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              station.open ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            {station.open ? "Open Now" : "Closed"}
          </span>
        </div>

        {station.rating && (
          <div className="flex items-center gap-2">
            <Star size={18} className="text-green-400" />
            <span>{station.rating}</span>
          </div>
        )}

        {/* Overlay content */}
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col justify-end p-5 space-y-2">
          {/* Name and Open/Closed Badge */}
          <div className="flex justify-between items-center">
            <h1 className="text-green-400 font-bold text-xl">{station.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                station.open ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              {station.open ? "Open Now" : "Closed"}
            </span>
          </div>

          {/* Available Chargers */}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                availableChargers.length > 0
                  ? "bg-green-100 text-green-500"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {availableChargers.length}/{station.chargers.length} Available
            </span>
          </div>

          {/* Rating */}
          {station.rating && (
            <div className="flex items-center gap-2 text-white">
              <Star size={18} className="text-green-400" />
              <span>
                {station.rating.toFixed(1)} ({station.rating})
              </span>
            </div>
          )}

          {/* Address */}
          <div className="flex items-center gap-2 text-green-400">
            <MapPin size={18} />
            <p>{station.address}</p>
          </div>

          {/* Operator */}
          {station.operatorName && (
            <div className="flex items-center gap-2 text-gray-300">
              <Building2 size={16} />
              <span>Operated by {station.operatorName}</span>
            </div>
          )}
        </div>
        {station.operatorName && (
          <div className="flex items-center gap-2 text-gray-400">
            <Building2 size={16} />
            <span>Operated by {station.operatorName}</span>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="bg-[#0E1424] p-4 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3">Pricing</h2>
        {!station.tariffRules || station.tariffRules.length === 0 ? (
          <p className="text-gray-400">Contact station for pricing details</p>
        ) : (
          station.tariffRules.map((rule: TariffRule, idx: number) => (
            <div key={idx} className="flex justify-between text-sm mb-2">
              <span>{rule.description ?? "General"}</span>
              <span className="text-green-400">
                Rs {rule.pricePerKwh.toFixed(2)} / kWh
              </span>
            </div>
          ))
        )}
      </div>

      {/* Chargers */}
      <div className="bg-[#0E1424] p-4 rounded-2xl border border-[#1A2236]">
        <h2 className="text-green-400 font-semibold mb-3">Chargers</h2>
        {station.chargers && station.chargers.length > 0 ? (
          station.chargers.map((charger: Charger) => {
            console.log(charger); // logs each charger
            return (
              <div
                key={charger.id}
                className="p-3 border border-[#1A2236] rounded-lg mb-2 flex justify-between cursor-pointer"
                onClick={() =>
                  charger.status === "AVAILABLE" &&
                  navigate(`/booking/${station.id}/${charger.id}`)
                }
              >
                <span>
                  {charger.connectorType} ({charger.maxPowerKw} kW)
                </span>
                <span
                  className={`${
                    charger.status === "Available"
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {charger.status}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">No chargers available</p>
        )}
      </div>

      {/* Amenities */}
      {station.amenities && station.amenities.length > 0 && (
        <div className="bg-[#0E1424] p-4 rounded-2xl border border-[#1A2236]">
          <h2 className="text-green-400 font-semibold mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {station.amenities.map((a, i) => (
              <span
                key={i}
                className="px-2 py-1 border border-[#1A2236] rounded-full flex items-center gap-1 text-sm"
              >
                {amenityIcons[a.toLowerCase()] ?? "•"} {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {station.description && (
        <div className="bg-[#0E1424] p-4 rounded-2xl border border-[#1A2236]">
          <h2 className="text-green-400 font-semibold mb-2">About</h2>
          <p className="text-gray-400">{station.description}</p>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#0E1424] border-t border-[#1A2236] flex gap-3">
        <button className="flex-1 border border-green-500 text-green-400 py-3 rounded-lg flex items-center justify-center gap-2">
          <Navigation size={18} /> Directions
        </button>
        <button
          disabled={availableChargers.length === 0}
          className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold ${
            availableChargers.length === 0
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          onClick={() => {
            if (availableChargers.length === 1) {
              navigate(`/booking/${station.id}/${availableChargers[0].id}`);
            }
          }}
        >
          <Calendar size={18} /> Book Now
        </button>
      </div>
    </div>
  );
};

export default StationDetails;

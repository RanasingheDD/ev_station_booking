import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { getStationById, updateStation } from "../../services/station_service";
import ChargerManagement from "../ChargerManagement/ChargerManagement"; 
import type { Station, Charger } from "../../models/station_model";

export default function OwnerStationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStation();
  }, [id]);

  const loadStation = async () => {
    if (!id) return;
    try {
      const data = await getStationById(id);
      setStation(data);
    } catch (error) {
      console.error("Error loading station:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Connects ChargerManagement to the Backend
  const handleChargerUpdate = async (updatedChargers: Charger[]) => {
    if (!station || !station.id) return;

    // Optimistic UI Update (Instant feedback)
    setStation({ ...station, chargers: updatedChargers });

    try {
      // Send entire station update with new chargers list
      await updateStation(station.id, { 
        ...station, 
        chargers: updatedChargers 
      });
    } catch (error) {
      console.error("Failed to save chargers:", error);
      alert("Failed to save changes.");
      loadStation(); // Revert on error
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!station) return <div className="p-10 text-center">Station not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate("/owner-dashboard")}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{station.name}</h1>
          <div className="flex items-center text-gray-500 mt-2">
            <MapPin size={18} className="mr-1" />
            {station.address}
          </div>
        </div>

        {/* 🔌 THE CHARGER MANAGEMENT SECTION */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            Charger Management
          </h2>
          <ChargerManagement 
            chargers={station.chargers || []} 
            stationId={station.id!}
            onUpdate={handleChargerUpdate} 
          />
        </div>
      </div>
    </div>
  );
}
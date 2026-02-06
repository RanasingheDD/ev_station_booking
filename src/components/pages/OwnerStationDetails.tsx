import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, LayoutDashboard, Zap, Star } from "lucide-react";
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

  const handleChargerUpdate = async (updatedChargers: Charger[]) => {
    if (!station || !station.id) return;
    
    // Optimistic Update
    setStation({ ...station, chargers: updatedChargers });

    try {
      await updateStation(station.id, { 
        ...station, 
        chargers: updatedChargers 
      });
    } catch (error) {
      console.error("Failed to save chargers:", error);
      alert("Failed to save changes.");
      loadStation();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mb-4"></div>
    </div>
  );
  
  if (!station) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Station not found</div>;

  // Default fallback image if none exists
  const bannerImage = station.images?.[0] || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      
      {/* 🖼️ HERO BANNER SECTION */}
      <div className="relative h-80 w-full overflow-hidden">
        {/* Background Image */}
        <img 
          src={bannerImage} 
          alt={station.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Dark Gradient Overlay (Makes text readable) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        {/* Back Button (Floating) */}
        <div className="absolute top-6 left-6 z-10">
           <button 
            onClick={() => navigate("/owner-dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-slate-900 backdrop-blur-md border border-white/10 text-white rounded-xl transition-all"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {/* Station Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${station.isOpen ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                {station.isOpen ? "OPEN NOW" : "CLOSED"}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                <Star size={12} className="fill-current" /> {station.rating?.toFixed(1) || "New"}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 shadow-sm">{station.name}</h1>
            <div className="flex items-center text-slate-300">
              <MapPin size={18} className="mr-2 text-indigo-400" />
              {station.address}
            </div>
          </div>

          {/* Quick Stats on Banner */}
          <div className="flex gap-4">
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-xl min-w-[120px]">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Total Chargers</p>
              <div className="flex items-center gap-2 text-white font-bold text-2xl">
                <LayoutDashboard size={24} className="text-indigo-400" />
                {station.chargers?.length || 0}
              </div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-xl min-w-[120px]">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Max Power</p>
              <div className="flex items-center gap-2 text-white font-bold text-2xl">
                <Zap size={24} className="text-yellow-400" />
                {Math.max(...(station.chargers?.map(c => c.maxPowerKw) || [0]))} kW
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔌 THE CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 ring-1 ring-white/5">
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
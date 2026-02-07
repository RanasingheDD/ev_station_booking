import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Zap,
  DollarSign,
  Calendar,
  Power,
  AlertCircle,
  Search,
  X,
  Image as ImageIcon,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import {
  fetchOwnerStations,
  createStation,
  updateStation,
  deleteStation,
  getStationStats,
} from "../../services/station_service";
import type { Station } from "../../models/station_model";
import { fetchCurrentUser } from "../../services/account_service";

// 🎨 "COMMAND CENTER" THEME (Slate & Indigo)
const styles = {
  // Backgrounds
  pageBg: "bg-slate-950", // Very dark slate (almost black, but blue-ish)
  cardBg: "bg-slate-900", // Slightly lighter for cards
  modalBg: "bg-slate-900",
  
  // Inputs
  input: "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-500",
  
  // Text
  textPrimary: "text-slate-100",
  textSecondary: "text-slate-400",
  label: "block text-sm font-medium text-slate-300 mb-2",
  
  // Buttons
  // Primary (Add/Save) -> Indigo
  buttonPrimary: "flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed font-medium",
  
  // Secondary (Cancel/Edit) -> Dark Slate
  buttonSecondary: "flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-colors font-medium",  
  // Danger (Delete) -> Red
  buttonDanger: "flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20 font-medium",
  
  // Manage Button (Specific styling)
  buttonManage: "flex-1 flex items-center justify-center gap-2 bg-slate-800 text-indigo-400 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-indigo-300 transition-colors font-medium",

  // Overlays
  modalOverlay: "fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4",
  modalContent: "bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-white/10",
};

// ----------------------------------------------------------------------
// 1. MODAL COMPONENT
// ----------------------------------------------------------------------
const StationModal = ({
  isOpen,
  onClose,
  station,
  onSave,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  station: Station | null;
  onSave: (data: Partial<Station>) => Promise<void>;
  userId: string;
}) => {
  const [formData, setFormData] = useState<Partial<Station>>({
    name: "",
    address: "",
    lat: 0,
    lng: 0,
    phoneNumber: "",
    description: "",
    operatorId: userId,
    operatorName: "",
    isOpen: true,
    rating: 0,
    reviewCount: 0,
    images: [],
    chargers: [],
    tariffRules: [],
    amenities: [],
    supportsConnectors: [],
    operatingHours: {},
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (station) {
      setFormData(station);
    } else {
      setFormData({
        name: "",
        address: "",
        lat: 0,
        lng: 0,
        phoneNumber: "",
        description: "",
        operatorId: userId,
        operatorName: "",
        isOpen: true,
        rating: 0,
        reviewCount: 0,
        images: [],
        chargers: [],
        tariffRules: [],
        amenities: [],
        supportsConnectors: [],
        operatingHours: {},
      });
    }
  }, [station, userId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [base64String], 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving station:", error);
      alert("Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseFloat(value) || 0
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="text-indigo-500" size={24} />
            {station ? "Edit Station" : "Add New Station"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" title="Close Modal">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-5">
            <h3 className="font-semibold text-lg text-indigo-400 border-b border-slate-800 pb-2">
              Basic Information
            </h3>

            <div>
              <label className={styles.label}>Station Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="e.g., GreenEnergy Hub"
              />
            </div>

            <div>
              <label className={styles.label}>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Full address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={styles.label}>Latitude *</label>
                <input
                  type="number"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  step="any"
                  className={styles.input}
                  placeholder="6.9271"
                />
              </div>
              <div>
                <label className={styles.label}>Longitude *</label>
                <input
                  type="number"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  step="any"
                  className={styles.input}
                  placeholder="79.8612"
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={styles.input}
                placeholder="+94 XX XXX XXXX"
              />
            </div>

            <div>
              <label className={styles.label}>Operator Name</label>
              <input
                type="text"
                name="operatorName"
                value={formData.operatorName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Your Name / Company"
              />
            </div>

            <div>
              <label className={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={styles.input}
                placeholder="Tell drivers about your station..."
              />
            </div>

            {/* Dark Mode File Upload */}
            <div>
              <label className={`${styles.label} flex items-center gap-2`}>
                <ImageIcon size={16} className="text-indigo-400" /> Station Image
              </label>
              
              <div className="border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-xl p-6 text-center cursor-pointer relative hover:border-indigo-500 hover:bg-slate-800 transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload Station Image"
                />
                
                {formData.images?.[0] ? (
                  <div className="relative h-48 w-full">
                    <img 
                      loading="lazy"
                      decoding="async"
                      src={formData.images[0]} 
                      alt="Preview" 
                      className="h-full w-full object-cover rounded-lg shadow-lg ring-1 ring-white/10"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg backdrop-blur-sm">
                      <p className="text-white font-medium flex items-center gap-2">
                        <Edit size={16} /> Change Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="mx-auto w-12 h-12 bg-slate-700 text-indigo-400 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-slate-300 font-medium">Click to upload image</p>
                    <p className="text-xs text-slate-500 mt-1">Max size: 2MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-slate-300 font-medium">Station Open Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isOpen: e.target.checked }))}
                  className="sr-only peer"
                  title="Toggle Station Open/Closed Status"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className={styles.buttonSecondary}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.buttonPrimary}>
              {loading ? "Saving..." : station ? "Update Station" : "Create Station"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. DELETE CONFIRMATION MODAL
// ----------------------------------------------------------------------
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  stationName,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stationName: string;
  loading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Delete Station?</h3>
            <p className="text-sm text-slate-400">This action is permanent.</p>
          </div>
        </div>

        <p className="text-slate-300 mb-6 leading-relaxed">
          Are you sure you want to delete <strong className="text-white">{stationName}</strong>? 
          All chargers and history will be wiped out.
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className={styles.buttonSecondary}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className={styles.buttonDanger}>
            {loading ? "Deleting..." : "Delete Station"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. MAIN DASHBOARD
// ----------------------------------------------------------------------
export default function OwnerDashboard() {
  useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingStation, setDeletingStation] = useState<Station | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [stats, setStats] = useState({
    totalStations: 0,
    totalEarnings: 0,
    activeBookings: 0,
    totalChargers: 0,
    availableChargers: 0,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData.user || userData);
      } catch (error) {
        console.error("Failed to load user profile", error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadStations();
    }
  }, [user]);

  const loadStations = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await fetchOwnerStations(user.id);
      setStations(data);
      setFilteredStations(data);
      const stationStats = getStationStats(data);
      setStats({
        totalStations: data.length,
        totalEarnings: 0,
        activeBookings: 0,
        totalChargers: stationStats.totalChargers,
        availableChargers: stationStats.availableChargers,
      });
    } catch (error) {
      console.error("Error loading stations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStations(stations);
    } else {
      const filtered = stations.filter(
        (station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStations(filtered);
    }
  }, [searchQuery, stations]);

  const handleSaveStation = async (stationData: Partial<Station>) => {
    try {
      if (editingStation) {
        await updateStation(editingStation.id!, stationData);
      } else {
        await createStation({ ...stationData, operatorId: user.id });
      }
      await loadStations();
      setShowModal(false);
      setEditingStation(null);
    } catch (error) {
      console.error("Error saving station:", error);
      throw error;
    }
  };

  const handleDeleteStation = async () => {
    if (!deletingStation) return;
    setDeleteLoading(true);
    try {
      await deleteStation(deletingStation.id!);
      await loadStations();
      setShowDeleteModal(false);
      setDeletingStation(null);
    } catch (error) {
      console.error("Error deleting station:", error);
      alert("Failed to delete.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  // Status Badge Logic
  const getStatusColor = (station: Station) => {
    if (!station.isOpen) return "bg-red-500/10 text-red-400 border-red-500/20";
    const available = station.chargers?.filter((c) => c.status === "AVAILABLE").length || 0;
    return available === 0 
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  };

  const getStatusText = (station: Station) => {
    if (!station.isOpen) return "Closed";
    const available = station.chargers?.filter((c) => c.status === "AVAILABLE").length || 0;
    return available === 0 ? "Full" : `${available} Available`;
  };

  return (
    <div className={`min-h-screen ${styles.pageBg} text-slate-200`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/20 rounded-lg">
                <LayoutDashboard className="text-indigo-400" size={28} />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Owner Dashboard
              </h1>
            </div>
            <p className="text-slate-400 mt-2 ml-1">
              Welcome back, <span className="text-indigo-400 font-medium">{user?.name || "Partner"}</span>!
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingStation(null);
                setShowModal(true);
              }}
              className={styles.buttonPrimary}
            >
              <div className="flex items-center gap-2">
                <Plus size={20} /> Add Station
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Stations", value: stats.totalStations, icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10" },
            { label: "Total Earnings", value: `$${stats.totalEarnings.toFixed(2)}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Active Bookings", value: stats.activeBookings, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Available Chargers", value: `${stats.availableChargers}/${stats.totalChargers}`, icon: Power, color: "text-amber-400", bg: "bg-amber-500/10" },
          ].map((stat, idx) => (
            <div key={idx} className={`${styles.cardBg} border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-slate-600 shadow-md"
            />
          </div>
        </div>

        {/* Stations List */}
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          My Stations
          {searchQuery && <span className="text-sm font-normal text-slate-500">({filteredStations.length})</span>}
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mb-4"></div>
            Loading stations...
          </div>
        ) : filteredStations.length === 0 ? (
          <div className={`${styles.cardBg} border border-slate-800 rounded-2xl p-12 text-center border-dashed`}>
            <Zap className="mx-auto text-slate-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No stations found</h3>
            <p className="text-slate-500">Get started by adding your first station.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.map((station) => (
              <div key={station.id} className={`${styles.cardBg} border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-500 transition-all duration-300 shadow-lg`}>
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={station.images?.[0] || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000"}
                    alt={station.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${getStatusColor(station)}`}>
                    {getStatusText(station)}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-white mb-1 truncate">{station.name}</h3>
                  <div className="flex items-center text-slate-400 text-sm mb-5">
                    <MapPin size={16} className="mr-1 shrink-0 text-indigo-500" />
                    <span className="truncate">{station.address}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-800 mb-4 bg-slate-900/50 rounded-lg">
                    <div className="text-center border-r border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Chargers</p>
                      <p className="font-bold text-white text-lg">{station.chargers?.length || 0}</p>
                    </div>
                    <div className="text-center border-r border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rating</p>
                      <p className="font-bold text-amber-400 text-lg">★ {station.rating?.toFixed(1) || "-"}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</p>
                      <p className={`font-bold text-lg ${station.isOpen ? "text-emerald-400" : "text-red-400"}`}>
                        {station.isOpen ? "Open" : "Closed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => { setEditingStation(station); setShowModal(true); }} 
                      className={styles.buttonSecondary}
                      title="Edit Station"
                    >
                      <Edit size={18} />
                      <span>Edit</span>
                    </button>
                    
                    <button 
                      onClick={() => navigate(`/owner/station/${station.id}`)} 
                      className={styles.buttonManage}
                    >
                      <Zap size={18} /> Manage
                    </button>
                    
                    <button 
                      onClick={() => { setDeletingStation(station); setShowDeleteModal(true); }} 
                      className="px-3 py-2 border border-slate-700 bg-slate-800 text-red-400 rounded-xl hover:bg-red-900/20 hover:border-red-900/50 transition-colors"
                      title="Delete Station"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <StationModal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setEditingStation(null); }} 
        station={editingStation} 
        onSave={handleSaveStation} 
        userId={user?.id || ""} 
      />
      
      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => { setShowDeleteModal(false); setDeletingStation(null); }} 
        onConfirm={handleDeleteStation} 
        stationName={deletingStation?.name || ""} 
        loading={deleteLoading} 
      />
    </div>
  );
}
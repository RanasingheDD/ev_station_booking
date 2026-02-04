import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  TrendingUp,
  Zap,
  DollarSign,
  Calendar,
  Power,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import { API_URL } from "../../config/api_config";
import {
  fetchOwnerStations,
  createStation,
  updateStation,
  deleteStation,
  getStationStats,
  calculateStationEarnings,
} from "../../services/station_service";
import type { Station } from "../../models/station_model";

// Modal Component for Add/Edit Station
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving station:", error);
      alert("Failed to save station. Please try again.");
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {station ? "Edit Station" : "Add New Station"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
            title="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Station Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., GreenEnergy Hub - Colombo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Full address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude *
                </label>
                <input
                  type="number"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  step="any"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="6.9271"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude *
                </label>
                <input
                  type="number"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  step="any"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="79.8612"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+94 XX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operator Name
              </label>
              <input
                type="text"
                name="operatorName"
                value={formData.operatorName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your company/business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Brief description of your charging station"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isOpen"
                checked={formData.isOpen}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isOpen: e.target.checked }))
                }
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                title="Station Open Status"
              />
              <label className="text-sm font-medium text-gray-700">
                Station is currently open
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Saving..." : station ? "Update Station" : "Create Station"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Delete Station</h3>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{stationName}</strong>? All associated
          chargers and data will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
            type="button"
          >
            {loading ? "Deleting..." : "Delete Station"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Owner Dashboard Component
export default function OwnerDashboard() {
  useAuth();

  const [user, setUser] = useState<any>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingStation, setDeletingStation] = useState<Station | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalStations: 0,
    totalEarnings: 0,
    activeBookings: 8, // Mock data - replace with real API
    totalChargers: 0,
    availableChargers: 0,
  });

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch owner's stations
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

      // Calculate stats
      const stationStats = getStationStats(data);
      setStats({
        totalStations: data.length,
        totalEarnings: calculateStationEarnings(data),
        activeBookings: 8, // Mock - replace with real data
        totalChargers: stationStats.totalChargers,
        availableChargers: stationStats.availableChargers,
      });
    } catch (error) {
      console.error("Error loading stations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
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

  // Handle add/edit station
  const handleSaveStation = async (stationData: Partial<Station>) => {
    try {
      if (editingStation) {
        // Update existing station
        await updateStation(editingStation.id!, stationData);
      } else {
        // Create new station
        await createStation({
          ...stationData,
          operatorId: user.id,
        });
      }

      await loadStations();
      setShowModal(false);
      setEditingStation(null);
    } catch (error) {
      console.error("Error saving station:", error);
      throw error;
    }
  };

  // Handle delete station
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
      alert("Failed to delete station. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (station: Station) => {
    if (!station.isOpen) return "bg-red-100 text-red-700";

    const availableChargers = station.chargers?.filter(
      (c) => c.status === "AVAILABLE"
    ).length || 0;

    if (availableChargers === 0) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusText = (station: Station) => {
    if (!station.isOpen) return "Closed";

    const availableChargers = station.chargers?.filter(
      (c) => c.status === "AVAILABLE"
    ).length || 0;

    if (availableChargers === 0) return "Full";
    return `${availableChargers} Available`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {user?.username || "Partner"}!
            </p>
          </div>
          <button
            onClick={() => {
              setEditingStation(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            type="button"
          >
            <Plus size={20} />
            Add New Station
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm">Total Stations</p>
              <Zap className="text-green-600" size={20} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.totalStations}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <DollarSign className="text-green-600" size={20} />
            </div>
            <h3 className="text-3xl font-bold text-green-600">
              ${stats.totalEarnings.toFixed(2)}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm">Active Bookings</p>
              <Calendar className="text-blue-600" size={20} />
            </div>
            <h3 className="text-3xl font-bold text-blue-600">
              {stats.activeBookings}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm">Available Chargers</p>
              <Power className="text-purple-600" size={20} />
            </div>
            <h3 className="text-3xl font-bold text-purple-600">
              {stats.availableChargers}/{stats.totalChargers}
            </h3>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search stations by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stations List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            My Charging Stations
            {searchQuery && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredStations.length} results)
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading stations...</p>
            </div>
          </div>
        ) : filteredStations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Zap className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? "No stations found" : "No stations yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding your first charging station"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => {
                  setEditingStation(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                type="button"
              >
                <Plus size={20} />
                Add Your First Station
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="relative h-48">
                  <img
                    src={
                      station.images?.[0] ||
                      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000"
                    }
                    alt={station.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      station
                    )}`}
                  >
                    {getStatusText(station)}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {station.name}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin size={16} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{station.address}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-gray-100 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Chargers</p>
                      <p className="font-semibold text-gray-700">
                        {station.chargers?.length || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Rating</p>
                      <p className="font-semibold text-gray-700">
                        ⭐ {station.rating?.toFixed(1) || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="font-semibold text-green-600">
                        {station.isOpen ? "Open" : "Closed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingStation(station);
                        setShowModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      type="button"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletingStation(station);
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete station"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Station Modal */}
      <StationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStation(null);
        }}
        station={editingStation}
        onSave={handleSaveStation}
        userId={user?.id || ""}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingStation(null);
        }}
        onConfirm={handleDeleteStation}
        stationName={deletingStation?.name || ""}
        loading={deleteLoading}
      />
    </div>
  );
}

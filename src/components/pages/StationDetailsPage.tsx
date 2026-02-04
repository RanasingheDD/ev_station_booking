import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Star,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { getStationById, updateStation, deleteStation } from "../../services/station_service";
import ChargerManagement from "../ChargerManagement/ChargerManagement";
import type { Station } from "../../models/station_model";

export default function StationDetailsPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();

  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Station>>({});

  useEffect(() => {
    loadStationDetails();
  }, [stationId]);

  const loadStationDetails = async () => {
    if (!stationId) return;

    setLoading(true);
    try {
      const data = await getStationById(stationId);
      setStation(data);
      setFormData(data);
    } catch (error) {
      console.error("Error loading station:", error);
      alert("Failed to load station details");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!stationId) return;

    setSaving(true);
    try {
      await updateStation(stationId, formData);
      await loadStationDetails();
      setEditMode(false);
      alert("Station updated successfully!");
    } catch (error) {
      console.error("Error updating station:", error);
      alert("Failed to update station");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!stationId || !station) return;

    if (
      !confirm(
        `Are you sure you want to delete "${station.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteStation(stationId);
      alert("Station deleted successfully");
      navigate("/owner/dashboard");
    } catch (error) {
      console.error("Error deleting station:", error);
      alert("Failed to delete station");
    }
  };

  const handleChargersUpdate = async (updatedChargers: any[]) => {
    setFormData({ ...formData, chargers: updatedChargers });
    // Auto-save chargers
    try {
      await updateStation(stationId!, { ...formData, chargers: updatedChargers });
      await loadStationDetails();
    } catch (error) {
      console.error("Error updating chargers:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading station details...</p>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Station not found</p>
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="text-green-600 hover:text-green-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {editMode ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border-b-2 border-green-500 focus:outline-none"
                    title="Station Name"
                  />
                ) : (
                  station.name
                )}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="border-b border-gray-300 focus:border-green-500 focus:outline-none"
                      title="Station Address"
                    />
                  ) : (
                    <span>{station.address}</span>
                  )}
                </div>
                {station.phoneNumber && (
                  <div className="flex items-center gap-1">
                    <Phone size={16} />
                    <span>{station.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData(station);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    type="button"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    type="button"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    type="button"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    type="button"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Station Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Station Images
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {station.images && station.images.length > 0 ? (
                  station.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${station.name} ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))
                ) : (
                  <div className="col-span-2 bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                    <p className="text-gray-400">No images available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Description
              </h2>
              {editMode ? (
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
                  placeholder="Add a description..."
                />
              ) : (
                <p className="text-gray-600">
                  {station.description || "No description available"}
                </p>
              )}
            </div>

            {/* Chargers */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <ChargerManagement
                chargers={formData.chargers || []}
                stationId={station.id!}
                onUpdate={handleChargersUpdate}
              />
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      station.isOpen
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {station.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-500 fill-yellow-500" size={16} />
                    <span className="font-semibold">
                      {station.rating?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({station.reviewCount || 0})
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Chargers</span>
                  <span className="font-semibold">
                    {station.chargers?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available</span>
                  <span className="font-semibold text-green-600">
                    {station.chargers?.filter((c) => c.status === "AVAILABLE")
                      .length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Location
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Latitude:</span>
                  <span className="ml-2 font-mono">{station.lat}</span>
                </div>
                <div>
                  <span className="text-gray-600">Longitude:</span>
                  <span className="ml-2 font-mono">{station.lng}</span>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            {station.operatingHours &&
              Object.keys(station.operatingHours).length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock size={20} />
                    Operating Hours
                  </h2>
                  <div className="space-y-2 text-sm">
                    {Object.entries(station.operatingHours).map(
                      ([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{day}</span>
                          <span className="font-medium">{hours}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Amenities */}
            {station.amenities && station.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {station.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Power, Zap, X } from "lucide-react";
import type { Charger, ChargerStatus } from "../../models/station_model";

interface ChargerManagementProps {
  chargers: Charger[];
  stationId: string;
  onUpdate: (chargers: Charger[]) => void;
}

// Charger Form Modal
const ChargerFormModal = ({
  isOpen,
  onClose,
  charger,
  onSave,
  stationId,
}: {
  isOpen: boolean;
  onClose: () => void;
  charger: Charger | null;
  onSave: (data: Charger) => void;
  stationId: string;
}) => {
  const [formData, setFormData] = useState<Charger>({
    id: "",
    stationId: stationId,
    connectorType: "Type 2",
    maxPowerKw: 0,
    status: "AVAILABLE",
    name: "",
    portNumber: 1,
  });

  // Update form data when charger prop changes
  useEffect(() => {
    if (charger) {
      setFormData(charger);
    } else {
      setFormData({
        id: "",
        stationId: stationId,
        connectorType: "Type 2",
        maxPowerKw: 0,
        status: "AVAILABLE",
        name: "",
        portNumber: 1,
      });
    }
  }, [charger, stationId]);

  const connectorTypes = [
    "Type 1 (J1772)",
    "Type 2 (Mennekes)",
    "CCS Type 1",
    "CCS Type 2",
    "CHAdeMO",
    "Tesla Supercharger",
    "GB/T",
  ];

  const statusOptions: { value: ChargerStatus; label: string; color: string }[] = [
    { value: "AVAILABLE", label: "Available", color: "text-green-600" },
    { value: "OCCUPIED", label: "Occupied", color: "text-yellow-600" },
    { value: "CHARGING", label: "Charging", color: "text-blue-600" },
    { value: "OUT_OF_SERVICE", label: "Out of Service", color: "text-red-600" },
    { value: "RESERVED", label: "Reserved", color: "text-purple-600" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            {charger ? "Edit Charger" : "Add New Charger"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
            title="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Charger Name
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="e.g., Fast Charger A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Port Number
            </label>
            <input
              type="number"
              value={formData.portNumber || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  portNumber: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="1"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Connector Type *
            </label>
            <select
              value={formData.connectorType}
              onChange={(e) =>
                setFormData({ ...formData, connectorType: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              title="Select connector type"
            >
              {connectorTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Power (kW) *
            </label>
            <input
              type="number"
              value={formData.maxPowerKw}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxPowerKw: parseFloat(e.target.value) || 0,
                })
              }
              required
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as ChargerStatus })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              title="Select charger status"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

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
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {charger ? "Update" : "Add"} Charger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Charger Management Component
export default function ChargerManagement({
  chargers,
  stationId,
  onUpdate,
}: ChargerManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCharger, setEditingCharger] = useState<Charger | null>(null);

  const getStatusColor = (status: ChargerStatus): string => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";
      case "OCCUPIED":
        return "bg-yellow-100 text-yellow-700";
      case "CHARGING":
        return "bg-blue-100 text-blue-700";
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-700";
      case "RESERVED":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: ChargerStatus) => {
    switch (status) {
      case "AVAILABLE":
        return <Power className="text-green-600" size={20} />;
      case "CHARGING":
        return <Zap className="text-blue-600" size={20} />;
      default:
        return <Power className="text-gray-600" size={20} />;
    }
  };

  const handleSaveCharger = (chargerData: Charger) => {
    if (editingCharger) {
      // Update existing charger
      const updatedChargers = chargers.map((c) =>
        c.id === editingCharger.id ? { ...chargerData, id: editingCharger.id } : c
      );
      onUpdate(updatedChargers);
    } else {
      // Add new charger with generated ID
      const newCharger: Charger = {
        ...chargerData,
        id: `charger_${Date.now()}`,
        stationId: stationId,
      };
      onUpdate([...chargers, newCharger]);
    }
    setShowModal(false);
    setEditingCharger(null);
  };

  const handleDeleteCharger = (chargerId: string) => {
    if (window.confirm("Are you sure you want to delete this charger?")) {
      const updatedChargers = chargers.filter((c) => c.id !== chargerId);
      onUpdate(updatedChargers);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Chargers ({chargers.length})
        </h3>
        <button
          onClick={() => {
            setEditingCharger(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm transition-colors"
          type="button"
        >
          <Plus size={16} />
          Add Charger
        </button>
      </div>

      {chargers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Zap className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="text-gray-500">No chargers added yet</p>
          <button
            onClick={() => {
              setEditingCharger(null);
              setShowModal(true);
            }}
            className="mt-3 text-green-600 hover:text-green-700 font-medium text-sm"
            type="button"
          >
            Add your first charger
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chargers.map((charger) => (
            <div
              key={charger.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(charger.status)}
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {charger.name || `Port ${charger.portNumber || "N/A"}`}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {charger.connectorType}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    charger.status
                  )}`}
                >
                  {charger.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-gray-600">Power:</span>
                <span className="font-semibold text-gray-800">
                  {charger.maxPowerKw} kW
                </span>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={() => {
                    setEditingCharger(charger);
                    setShowModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm transition-colors"
                  type="button"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCharger(charger.id)}
                  className="flex items-center justify-center px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  type="button"
                  title="Delete charger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ChargerFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCharger(null);
        }}
        charger={editingCharger}
        onSave={handleSaveCharger}
        stationId={stationId}
      />
    </div>
  );
}

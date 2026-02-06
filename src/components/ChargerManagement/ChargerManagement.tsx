import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Power, Zap, X, Plug } from "lucide-react";
import type { Charger, ChargerStatus } from "../../models/station_model";

interface ChargerManagementProps {
  chargers: Charger[];
  stationId: string;
  onUpdate: (chargers: Charger[]) => void;
}

// 🎨 SHARED DARK STYLES
const styles = {
  input: "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-500",
  label: "block text-sm font-medium text-slate-300 mb-2",
  modalOverlay: "fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4",
  modalContent: "bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl ring-1 ring-white/10",
  buttonPrimary: "px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 font-medium",
  buttonSecondary: "px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-colors font-medium",
};

// Charger Form Modal (Dark Mode)
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

  const statusOptions: { value: ChargerStatus; label: string }[] = [
    { value: "AVAILABLE", label: "Available" },
    { value: "OCCUPIED", label: "Occupied" },
    { value: "CHARGING", label: "Charging" },
    { value: "OUT_OF_SERVICE", label: "Out of Service" },
    { value: "RESERVED", label: "Reserved" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plug className="text-indigo-500" size={20} />
            {charger ? "Edit Charger" : "Add New Charger"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" title="Close Modal">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={styles.label}>Charger Name</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.input}
              placeholder="e.g., Fast Charger A"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={styles.label}>Port Number</label>
              <input
                type="number"
                value={formData.portNumber || ""}
                onChange={(e) => setFormData({ ...formData, portNumber: parseInt(e.target.value) || 1 })}
                className={styles.input}
                min="1"
                title="Enter port number (e.g., 1, 2, 3...)"
              />
            </div>
            <div>
              <label className={styles.label}>Max Power (kW) *</label>
              <input
                type="number"
                value={formData.maxPowerKw}
                onChange={(e) => setFormData({ ...formData, maxPowerKw: parseFloat(e.target.value) || 0 })}
                required
                step="0.1"
                className={styles.input}
                title="Enter maximum power in kilowatts"
              />
            </div>
          </div>

          <div>
            <label className={styles.label}>Connector Type *</label>
            <select
              value={formData.connectorType}
              onChange={(e) => setFormData({ ...formData, connectorType: e.target.value })}
              required
              className={styles.input}
              title="Select Connector Type"
            >
              {connectorTypes.map((type) => (
                <option key={type} value={type} className="bg-slate-900">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={styles.label}>Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ChargerStatus })}
              required
              className={styles.input}
              title="Select Charger Status"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className={`flex-1 ${styles.buttonSecondary}`}>
              Cancel
            </button>
            <button type="submit" className={`flex-1 ${styles.buttonPrimary}`}>
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
      case "AVAILABLE": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "OCCUPIED": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "CHARGING": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "OUT_OF_SERVICE": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "RESERVED": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default: return "bg-slate-800 text-slate-400";
    }
  };

  const getStatusIcon = (status: ChargerStatus) => {
    switch (status) {
      case "AVAILABLE": return <Power className="text-emerald-500" size={20} />;
      case "CHARGING": return <Zap className="text-blue-500" size={20} />;
      case "OUT_OF_SERVICE": return <X className="text-red-500" size={20} />;
      default: return <Power className="text-slate-500" size={20} />;
    }
  };

  const handleSaveCharger = (chargerData: Charger) => {
    if (editingCharger) {
      const updatedChargers = chargers.map((c) =>
        c.id === editingCharger.id ? { ...chargerData, id: editingCharger.id } : c
      );
      onUpdate(updatedChargers);
    } else {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Chargers</h3>
          <p className="text-slate-400 text-sm">Manage ports and connectors</p>
        </div>
        <button
          onClick={() => {
            setEditingCharger(null);
            setShowModal(true);
          }}
          className={`flex items-center gap-2 ${styles.buttonPrimary}`}
          type="button"
        >
          <Plus size={18} />
          Add Charger
        </button>
      </div>

      {chargers.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-700">
          <Zap className="mx-auto text-slate-600 mb-3" size={40} />
          <p className="text-slate-400 font-medium">No chargers added yet</p>
          <button
            onClick={() => {
              setEditingCharger(null);
              setShowModal(true);
            }}
            className="mt-3 text-indigo-400 hover:text-indigo-300 font-medium text-sm hover:underline"
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
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-all shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                    {getStatusIcon(charger.status)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">
                      {charger.name || `Port ${charger.portNumber || "N/A"}`}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {charger.connectorType}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${getStatusColor(
                    charger.status
                  )}`}
                >
                  {charger.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-400">Max Power</span>
                <span className="font-mono font-bold text-white">
                  {charger.maxPowerKw} kW
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCharger(charger);
                    setShowModal(true);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 ${styles.buttonSecondary}`}
                  type="button"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCharger(charger.id)}
                  className="px-3 bg-slate-800 border border-slate-700 text-red-400 rounded-xl hover:bg-red-900/20 hover:border-red-900/50 transition-colors"
                  type="button"
                  title="Delete charger"
                >
                  <Trash2 size={18} />
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
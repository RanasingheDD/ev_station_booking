import React, { useEffect, useState } from "react";
import { X, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { loadEVs, addEV, deleteEV, type EV } from "../../services/ev_service";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";


type InputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
};

export const Input = ({ label, value, onChange, error, type = "text", placeholder }: InputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`w-full bg-[#0B0F19] p-3 rounded-lg border transition-colors text-white focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-[#1A2236] focus:border-green-500 focus:ring-green-500/30"
        }`}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
};


const EVHubDashboard: React.FC = () => {
  useAuth(); // Verify authentication

  // States
  const [evs, setEvs] = useState<EV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // New EV form states
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [maxChargeKw, setMaxChargeKw] = useState("");
  const [batteryKwh, setBatteryKwh] = useState("");
  const [connectorTypes, setConnectorTypes] = useState("");
  const [nickname, setNickname] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  // Form validation & feedback states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

const navigate = useNavigate();
const fetchedRef = useRef(false);

  // Load EVs on component mount
  useEffect(() => {

      if (fetchedRef.current) return;
  fetchedRef.current = true;

    const fetchEVs = async () => {
      try {
        const data = await loadEVs();
        setEvs(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load vehicles");
      } finally {
        setLoading(false);
      }
    };
    fetchEVs();
  }, []);

  // Handle adding new EV
  const handleAddEV = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form inputs
    const errors: Record<string, string> = {};
    
    if (!make.trim()) errors.make = "Make is required";
    if (!model.trim()) errors.model = "Model is required";
    if (!year.trim()) errors.year = "Year is required";
    if (year && (isNaN(Number(year)) || Number(year) < 1900 || Number(year) > new Date().getFullYear() + 1)) {
      errors.year = `Year must be between 1900 and ${new Date().getFullYear() + 1}`;
    }
    if (!batteryKwh.trim()) errors.batteryKwh = "Battery capacity is required";
    if (batteryKwh && (isNaN(Number(batteryKwh)) || Number(batteryKwh) <= 0)) {
      errors.batteryKwh = "Battery must be a positive number";
    }
    if (!maxChargeKw.trim()) errors.maxChargeKw = "Max charge is required";
    if (maxChargeKw && (isNaN(Number(maxChargeKw)) || Number(maxChargeKw) <= 0)) {
      errors.maxChargeKw = "Max charge must be a positive number";
    }
    if (!connectorTypes.trim()) errors.connectorTypes = "At least one connector type is required";
    if (!nickname.trim()) errors.nickname = "Nickname is required";
    if (!licensePlate.trim()) errors.licensePlate = "License plate is required";
    
    // License plate format validation (basic)
    if (licensePlate && !/^[A-Z0-9\-\s]{2,20}$/.test(licensePlate.toUpperCase())) {
      errors.licensePlate = "Invalid license plate format";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      const newEV: Omit<EV, "id"> = {
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        batteryKwh: Number(batteryKwh),
        maxChargeKw: Number(maxChargeKw),
        connectorTypes: connectorTypes.split(",").map((c) => c.trim()).filter(c => c),
        nickname: nickname.trim(),
        licensePlate: licensePlate.toUpperCase().trim(),
      };

      const savedEV = await addEV(newEV);
      if (savedEV) {
        setEvs((prev) => [...prev, savedEV]);
        setShowModal(false);
        setSuccessMessage(`${nickname} added successfully!`);
        setTimeout(() => setSuccessMessage(null), 4000);
        
        // Reset form
        setMake("");
        setModel("");
        setYear("");
        setBatteryKwh("");
        setMaxChargeKw("");
        setConnectorTypes("");
        setNickname("");
        setLicensePlate("");
        setFormErrors({});
      }
    } catch (err) {
      console.error(err);
      setFormErrors({ submit: "Failed to add vehicle. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle closing modal (clear errors on close)
  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  // Input field component with validation
  // Input component moved to module scope to avoid remounting on each render

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 flex ml-64">
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">My Vehicles</h2>
            <p className="text-gray-400 text-sm mt-1">Manage your electric vehicles</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Add New Vehicle
          </button>
        </div>

        {/* Success Message Toast */}
        {successMessage && (
          <div className="fixed top-5 right-5 z-40 max-w-md">
            <div className="bg-green-500/10 border border-green-500 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm">
              <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-400 font-semibold text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#101726] p-8 rounded-2xl w-full max-w-lg shadow-2xl border border-[#1A2236] max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl text-white font-bold">Add New Vehicle</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              {formErrors.submit && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-6 flex items-start gap-2">
                  <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{formErrors.submit}</p>
                </div>
              )}

              <form onSubmit={handleAddEV} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Make"
                    value={make}
                    onChange={setMake}
                    error={formErrors.make}
                    placeholder="e.g., Tesla, BMW"
                  />
                  <Input
                    label="Model"
                    value={model}
                    onChange={setModel}
                    error={formErrors.model}
                    placeholder="e.g., Model 3, i4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Year"
                    type="number"
                    value={year}
                    onChange={setYear}
                    error={formErrors.year}
                    placeholder={String(new Date().getFullYear())}
                  />
                  <Input
                    label="Battery Capacity (kWh)"
                    type="number"
                    value={batteryKwh}
                    onChange={setBatteryKwh}
                    error={formErrors.batteryKwh}
                    placeholder="e.g., 60"
                  />
                </div>

                <Input
                  label="Max Charge Power (kW)"
                  type="number"
                  value={maxChargeKw}
                  onChange={setMaxChargeKw}
                  error={formErrors.maxChargeKw}
                  placeholder="e.g., 11"
                />

                <Input
                  label="Connector Types (comma-separated)"
                  value={connectorTypes}
                  onChange={setConnectorTypes}
                  error={formErrors.connectorTypes}
                  placeholder="e.g., Type 2, CCS, CHAdeMO"
                />

                <Input
                  label="Nickname"
                  value={nickname}
                  onChange={setNickname}
                  error={formErrors.nickname}
                  placeholder="e.g., My Tesla"
                />

                <Input
                  label="License Plate"
                  value={licensePlate}
                  onChange={(val) => setLicensePlate(val.toUpperCase())}
                  error={formErrors.licensePlate}
                  placeholder="e.g., ABC-1234"
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Add Vehicle
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vehicle List */}
        <div className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your vehicles...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-xl p-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-semibold">Error</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && evs.length === 0 && (
            <div className="bg-[#101726] rounded-2xl p-12 text-center border border-dashed border-[#1A2236]">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-green-500/10 rounded-full">
                  <Plus size={32} className="text-green-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Vehicles Yet</h3>
              <p className="text-gray-400 mb-6">Add your first electric vehicle to get started with bookings</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} /> Add Your First Vehicle
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            evs.length > 0 &&
            evs.map((ev) => (
              <div
                key={ev.id}
                className="bg-[#101726] rounded-2xl overflow-hidden shadow-xl border border-[#1A2236] hover:border-[#2A3246] transition-all group"
              >
                <div className="grid md:grid-cols-3 gap-6 p-8">
                  {/* Vehicle Image */}
                  <div className="md:col-span-1 flex items-center justify-center bg-[#0B0F19] rounded-xl">
                    <img
                      loading="lazy"
                      decoding="async"
                      src="/car01.png"
                      alt={ev.nickname || ev.make}
                      className="w-full h-56 object-contain"
                    />
                  </div>

                  {/* Vehicle Details */}
                  <div className="md:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-1">
                        {ev.nickname}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {ev.make} {ev.model} • {ev.year}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#0B0F19] p-3 rounded-lg">
                          <p className="text-gray-400 text-xs font-medium">Battery</p>
                          <p className="text-white font-semibold mt-1">{ev.batteryKwh} kWh</p>
                        </div>
                        <div className="bg-[#0B0F19] p-3 rounded-lg">
                          <p className="text-gray-400 text-xs font-medium">Max Charge</p>
                          <p className="text-white font-semibold mt-1">{ev.maxChargeKw} kW</p>
                        </div>
                        <div className="bg-[#0B0F19] p-3 rounded-lg">
                          <p className="text-gray-400 text-xs font-medium">License Plate</p>
                          <p className="text-green-400 font-mono font-semibold mt-1">{ev.licensePlate}</p>
                        </div>
                        <div className="bg-[#0B0F19] p-3 rounded-lg">
                          <p className="text-gray-400 text-xs font-medium">Connectors</p>
                          <p className="text-white font-semibold mt-1 text-sm">{ev.connectorTypes?.join(", ") || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/app/stations")}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Use for Booking
                  </button>

                  {deletingId === ev.id ? (
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={async () => {
                          setIsDeleting(true);
                          const ok = await deleteEV(ev.id);
                          setIsDeleting(false);
                          setDeletingId(null);
                          if (ok) {
                            setEvs((prev) => prev.filter((x) => x.id !== ev.id));
                            setSuccessMessage("Vehicle removed");
                            setTimeout(() => setSuccessMessage(null), 3000);
                          } else {
                            setFormErrors({ submit: "Failed to delete vehicle" });
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Confirm"}
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(ev.id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      aria-label={`Delete ${ev.nickname}`}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}

                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default EVHubDashboard;
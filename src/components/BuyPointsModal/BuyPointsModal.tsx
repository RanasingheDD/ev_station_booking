import React, { useState } from "react";
import { X, Coins, CreditCard } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { API_URL } from "../../config/api_config";
import { BUY_POINT_PACKAGES } from "../../config/pricing";
import axios from "axios";

interface BuyPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  requiredPoints?: number;
}

const BuyPointsModal: React.FC<BuyPointsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  requiredPoints = 0,
}) => {
  const { user, updatePoints } = useUser();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Predefined point packages: points -> price (in LKR)
  const pointPackages = BUY_POINT_PACKAGES;

  const handleSelectPackage = (points: number) => {
    setSelectedPackage(points);
    setCustomAmount("");
    setError("");
  };

  const handleCustomAmount = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setSelectedPackage(null);
      setCustomAmount(value);
      setError("");
    }
  };

  const handleBuyPoints = async () => {
    const pointsToBuy = selectedPackage || parseInt(customAmount);

    if (!pointsToBuy || pointsToBuy <= 0) {
      setError("Please select or enter a valid amount");
      return;
    }

    const packageInfo = pointPackages.find((p) => p.points === pointsToBuy);
    const price = packageInfo ? packageInfo.price : pointsToBuy; // Default 1:1 ratio

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/bookings/checkouts`,
        { points: pointsToBuy, price },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      const data = response.data;

      if (response.status === 200 && data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = data.paymentUrl;
      } else if (response.status === 200 && data.success) {
        // Direct purchase (if no payment required)
        updatePoints((user?.points || 0) + pointsToBuy);
        setSelectedPackage(null);
        setCustomAmount("");
        onSuccess?.();
        onClose();
      } else {
        setError(data.message || "Failed to initiate purchase");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#101726] p-6 rounded-2xl w-full max-w-md shadow-lg relative border border-[#1A2236] max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="text-green-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Buy Points</h2>
          </div>
          <p className="text-gray-400 text-sm">
            1 Point = 1 LKR • Use points to book EV chargers
          </p>
          {requiredPoints > 0 && (
            <p className="text-yellow-400 text-sm mt-2">
              💡 You need {requiredPoints} points for this booking
            </p>
          )}
        </div>

        {/* Current Balance */}
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 mb-4">
          <p className="text-gray-400 text-sm">Current Balance</p>
          <p className="text-2xl font-bold text-green-400">
            {user?.points || 0} Points
          </p>
        </div>

        {/* Package Selection */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Select Package</h3>
          <div className="space-y-2">
            {pointPackages.map((pkg) => {
              const isDeal = (pkg.discount ?? 0) > 0;
              return (
                <button
                  key={pkg.points}
                  onClick={() => handleSelectPackage(pkg.points)}
                  className={`w-full p-3 rounded-lg border transition-all text-left
                    ${
                      selectedPackage === pkg.points
                        ? "border-green-500 bg-green-500/10"
                        : "border-[#1A2236] hover:border-green-500"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{pkg.points} Points</p>
                      <p className="text-sm text-gray-400">Rs. {pkg.price}</p>
                    </div>
                    {isDeal && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Save {pkg.discount}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Or Enter Custom Amount</h3>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            placeholder="Enter points (e.g., 250)"
            className="w-full bg-[#0B0F19] p-3 rounded-lg border border-[#1A2236] text-white placeholder-gray-500 focus:border-green-500 outline-none"
            min="1"
          />
          {customAmount && (
            <p className="text-gray-400 text-sm mt-2">
              Price: Rs. {customAmount}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-[#1A2236] text-white font-semibold hover:bg-[#0B0F19] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBuyPoints}
            disabled={loading || (!selectedPackage && !customAmount)}
            className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all
              ${
                loading || (!selectedPackage && !customAmount)
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white active:scale-95"
              }`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Buy Points
              </>
            )}
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-4 text-center">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
};

export default BuyPointsModal;

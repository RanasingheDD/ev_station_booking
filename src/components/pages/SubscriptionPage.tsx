import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import {
  Check,
  Zap,
  Coins,
  AlertCircle,
  Loader,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useUser } from "../../context/UserContext";
import {
  getSubscriptionPlans,
  purchaseSubscriptionService,
  fetchUserSubscription,
  type SubscriptionPlan,
} from "../../services/subscription_service";
import { deductPointsService } from "../../services/account_service";
import BuyPointsModal from "../BuyPointsModal/BuyPointsModal";
import { motion, AnimatePresence } from "framer-motion";

interface UserSubscription {
  planId: string;
  name: string;
  expiresAt: string;
}

const SubscriptionPage: React.FC = () => {
  useAuth();
  // const navigate = useNavigate();
  const { user, deductPoints } = useUser();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showBuyPoints, setShowBuyPoints] = useState(false);
  const [insufficientFor, setInsufficientFor] = useState<string | null>(null);
  const [confirmPlan, setConfirmPlan] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setPlans(getSubscriptionPlans());
        const subscription = await fetchUserSubscription();
        setCurrentSubscription(subscription);
      } catch (err) {
        console.error("Error loading subscription data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handlePurchase = async (plan: SubscriptionPlan) => {
    const currentPoints = user?.points || 0;

    // Check sufficient points
    if (currentPoints < plan.pointsCost) {
      setInsufficientFor(plan.id);
      setShowBuyPoints(true);
      return;
    }

    // Show confirmation
    setConfirmPlan(plan);
  };

  const confirmPurchase = async () => {
    if (!confirmPlan) return;

    setPurchasing(confirmPlan.id);
    setError(null);
    setSuccess(null);

    try {
      // Deduct points
      await deductPointsService(confirmPlan.pointsCost);
      deductPoints(confirmPlan.pointsCost);

      // Purchase subscription
      const response = await purchaseSubscriptionService(
        confirmPlan.id,
        confirmPlan.pointsCost
      );

      // Update current subscription
      if (response) {
        setCurrentSubscription({
          planId: confirmPlan.id,
          name: confirmPlan.name,
          expiresAt: response.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      setSuccess(`✅ Successfully subscribed to ${confirmPlan.name}!`);
      setConfirmPlan(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Purchase error:", err);
      setError(`❌ Failed to purchase subscription: ${err.response?.data?.message || err.message}`);
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#0B0F19] text-gray-200 p-8 ml-64 overflow-y-auto flex items-center justify-center min-h-screen">
        <Loader className="animate-spin w-12 h-12 text-green-400" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0B0F19] text-gray-200 p-8 ml-64 overflow-y-auto">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-sm text-gray-400 mb-2">Pages / Subscriptions</h2>
        <h1 className="text-4xl font-bold text-white mb-2">Upgrade Your Plan</h1>
        <p className="text-gray-400">Choose the perfect subscription for your EV charging needs</p>
      </div>

      {/* Current Points & Active Subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Available Points</h3>
            <Coins className="text-green-400" size={28} />
          </div>
          <p className="text-4xl font-bold text-green-400 mb-2">{user?.points || 0}</p>
          <p className="text-gray-400 text-sm">1 Point = 1 LKR</p>
          <button
            onClick={() => {
              setInsufficientFor(null);
              setShowBuyPoints(true);
            }}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Buy More Points
          </button>
        </div>

        {/* Current Subscription Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Current Plan</h3>
            <Zap className="text-blue-400" size={28} />
          </div>
          {currentSubscription ? (
            <>
              <p className="text-2xl font-bold text-blue-400 mb-2">
                {currentSubscription.name}
              </p>
              <p className="text-gray-400 text-sm">
                Expires: {new Date(currentSubscription.expiresAt).toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-400 mb-2">No Plan</p>
              <p className="text-gray-400 text-sm">Choose a plan to get started</p>
            </>
          )}
        </div>

        {/* Savings Card (dynamic from plan config) */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Max Savings</h3>
          <div className="space-y-3">
            {(() => {
              const pro = plans.find((p) => p.id === "pro");
              const premium = plans.find((p) => p.id === "premium");
              const maxDiscount = Math.max(...plans.map((p) => p.discount || 0));
              return (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Pro Plan Discount:</span>
                    <span className="font-bold text-yellow-400">{pro?.discount ?? 0}% OFF</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Premium Discount:</span>
                    <span className="font-bold text-yellow-400">{premium?.discount ?? 0}% OFF</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-purple-500 pt-3 mt-3">
                    <span className="text-gray-300 font-semibold">Potential Savings:</span>
                    <span className="text-2xl font-bold text-yellow-400">Up to {maxDiscount}%</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Error & Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="text-red-400 mt-1 flex-shrink-0" size={20} />
            <p className="text-red-200">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-start gap-3"
          >
            <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
            <p className="text-green-200">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, idx) => {
          const isActive = currentSubscription?.planId === plan.id;
          const isDealierPlan = plans.findIndex((p) => p.id === currentSubscription?.planId) > idx;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                isActive
                  ? "border-green-500 bg-green-500/5 ring-2 ring-green-500/50"
                  : "border-gray-600 bg-[#101726] hover:border-green-400"
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold flex items-center gap-1">
                  <Check size={16} /> Active
                </div>
              )}

              {/* Downgrade Warning */}
              {isDealierPlan && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  Downgrade
                </div>
              )}

              <div className="p-8 h-full flex flex-col">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-600">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-green-400">{plan.pointsCost}</span>
                    <span className="text-gray-400">points</span>
                  </div>
                  {plan.discount && (
                    <p className="text-yellow-400 text-sm font-semibold">
                      💰 Save {plan.discount}% with this plan!
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="mb-8 flex-1">
                  <h4 className="text-sm font-semibold text-white mb-4">What's Included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Monthly Limit */}
                <div className="mb-8 p-4 bg-gray-700/30 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    <span className="font-semibold text-white">Monthly Limit: </span>
                    {plan.monthlyLimit === -1 ? (
                      <span className="text-green-400">Unlimited Sessions</span>
                    ) : (
                      <span>{plan.monthlyLimit} sessions/month</span>
                    )}
                  </p>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={isActive || purchasing === plan.id}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isActive
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  } ${purchasing === plan.id ? "opacity-70" : ""}`}
                >
                  {purchasing === plan.id ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : isActive ? (
                    <>
                      <Check size={18} />
                      Current Plan
                    </>
                  ) : (
                    <>
                      <Coins size={18} />
                      Subscribe Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ / Info Section */}
      <div className="bg-[#101726] rounded-2xl p-8 border border-gray-600">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-400">
              Yes, you can cancel your subscription anytime. No questions asked.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Do unused sessions rollover?</h3>
            <p className="text-gray-400">
              No, monthly sessions are reset each month. Use them or lose them!
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Can I upgrade later?</h3>
            <p className="text-gray-400">
              Absolutely! You can upgrade or downgrade your plan at any time.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">What if I run out of sessions?</h3>
            <p className="text-gray-400">
              You can still charge using points or upgrade to a higher plan.
            </p>
          </div>
        </div>
      </div>

      {/* Buy Points Modal */}
      {showBuyPoints && (
        <BuyPointsModal
                  isOpen={showBuyPoints} 
                  onClose={() => {
                      setShowBuyPoints(false);
                      setInsufficientFor(null);
                  } }
                  onSuccess={() => {
                      setShowBuyPoints(false);
                      // If they were trying to buy a subscription, allow retry
                  } }        />
      )}

      {/* Confirm Purchase Modal */}
      <AnimatePresence>
        {confirmPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setConfirmPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#101726] border border-green-500 rounded-2xl p-8 max-w-sm w-full mx-4"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Confirm Subscription</h2>

              <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                <p className="text-gray-400 mb-2">Plan:</p>
                <p className="text-xl font-bold text-green-400">{confirmPlan.name}</p>

                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="text-gray-400 mb-2">Points to Deduct:</p>
                  <p className="text-2xl font-bold text-white">{confirmPlan.pointsCost} points</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="text-gray-400 mb-2">Points After Purchase:</p>
                  <p className="text-2xl font-bold text-green-400">
                    {(user?.points || 0) - confirmPlan.pointsCost}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmPlan(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  disabled={purchasing !== null}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70"
                >
                  {purchasing ? "Processing..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionPage;

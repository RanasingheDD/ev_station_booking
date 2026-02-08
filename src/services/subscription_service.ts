import axios from "axios";
import { API_URL } from "../config/api_config";
import { SUBSCRIPTION_PLANS } from "../config/pricing";

// 🔐 Auth header helper
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 📦 Subscription plan interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  features: string[];
  monthlyLimit: number; // e.g. 50 charging sessions per month
  prioritySupport: boolean;
  discount?: number; // percentage
}

// 🎁 Purchase subscription with points
export const purchaseSubscriptionService = async (planId: string, pointsCost: number) => {
  const res = await axios.post(
    `${API_URL}/subscriptions/purchase`,
    { planId, pointsCost },
    { headers: { "Content-Type": "application/json", ...authHeader() } }
  );
  return res.data;
};

// 📋 Get user's active subscription
export const fetchUserSubscription = async () => {
  try {
    const res = await axios.get(`${API_URL}/subscriptions/me`, { headers: authHeader() });
    return res.data;
  } catch (err) {
    // No active subscription, return null
    return null;
  }
};

// 📌 Get available subscription plans (mock data)
export const getSubscriptionPlans = (): SubscriptionPlan[] => {
  return SUBSCRIPTION_PLANS as SubscriptionPlan[];
};

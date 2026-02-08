export interface PointPackage {
  points: number;
  price: number; // in LKR
  discount?: number; // percentage
}

export const BUY_POINT_PACKAGES: PointPackage[] = [
  { points: 500, price: 450, discount: 10 },
  { points: 1000, price: 850, discount: 15 },
  { points: 5000, price: 4000, discount: 20 },
];

export interface SubscriptionPlanConfig {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  features: string[];
  monthlyLimit: number; // -1 = unlimited
  prioritySupport: boolean;
  discount?: number; // percent
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanConfig[] = [
  {
    id: "basic",
    name: "Basic Plan",
    description: "Perfect for occasional EV users",
    pointsCost: 500,
    features: [
      "Up to 20 charging sessions/month",
      "Basic customer support",
      "Access to all stations",
      "Real-time availability updates",
    ],
    monthlyLimit: 20,
    prioritySupport: false,
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "For regular commuters and business users",
    pointsCost: 1200,
    features: [
      "Up to 100 charging sessions/month",
      "Priority customer support",
      "Access to all stations + reserved slots",
      "Real-time availability updates",
      "Monthly charging reports",
      "Exclusive partner discounts",
    ],
    monthlyLimit: 100,
    prioritySupport: true,
    discount: 10,
  },
  {
    id: "premium",
    name: "Premium Plan",
    description: "Unlimited charging for power users",
    pointsCost: 2500,
    features: [
      "Unlimited charging sessions/month",
      "24/7 VIP customer support",
      "Priority access to all stations",
      "Reserved charging slots",
      "Advanced analytics & insights",
      "Early access to new features",
      "Exclusive partner network access",
      "Free emergency charging support",
    ],
    monthlyLimit: -1,
    prioritySupport: true,
    discount: 20,
  },
];

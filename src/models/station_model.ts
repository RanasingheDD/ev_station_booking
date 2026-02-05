// src/models/station_model.ts

/**
 * Charger Status Enum
 * Matches ChargerModel.ChargerStatus from backend
 */
export type ChargerStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "OUT_OF_SERVICE"
  | "RESERVED"
  | "CHARGING";

/**
 * Charger Interface
 * Matches ChargerModel from backend
 */
export interface Charger {
  id: string;
  stationId: string;
  connectorType: string;
  maxPowerKw: number;
  status: ChargerStatus;
  ocppEndpointId?: string;
  qrCode?: string;
  name?: string;
  portNumber?: number;
}

/**
 * Tariff Type Enum
 * Matches TariffRuleModel.TariffType from backend
 */
export type TariffType = "PER_KWH" | "PER_MINUTE" | "FLAT_FEE" | "FLAT_PLUS_KWH";

/**
 * Time Range Interface
 * Matches TariffRuleModel.TimeRange from backend
 */
export interface TimeRange {
  startHour: number;
  endHour: number;
}

/**
 * Tariff Rule Interface
 * Matches TariffRuleModel from backend
 */
export interface TariffRule {
  id?: string;
  type: TariffType;
  price: number;
  flatFee?: number;
  currency?: string;
  description?: string;
  connectorType?: string;
  minPowerKw?: number;
  maxPowerKw?: number;
  pricePerKwh?: number;
  peakHours?: TimeRange;
  peakMultiplier?: number;
}

/**
 * Station Interface
 * Matches StationModel from backend
 */
export interface Station {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  operatorId: string;
  operatorName?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  supportsConnectors?: string[];
  tariffRules?: TariffRule[];
  chargers?: Charger[];
  description?: string;
  phoneNumber?: string;
  operatingHours?: Record<string, string>;
  amenities?: string[];
  isOpen: boolean;
  distance?: number;
}

/**
 * Booking Status Enum
 * Matches BookingModel.BookingStatus from backend
 */
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "NO_SHOW";

/**
 * Booking Interface
 * Matches BookingModel from backend
 */
export interface Booking {
  id?: string;
  userId: string;
  chargerId: string;
  stationId: string;
  startAt: string; // ISO date string
  endAt: string; // ISO date string
  status: BookingStatus;
  paymentId?: string;
  estimatedEnergy?: number;
  estimatedCost?: number;
  finalCost?: number;
  qrCode?: string;
  evId?: string;
  createdAt?: string; // ISO date string
  station?: Station;
  charger?: Charger;
}

/**
 * Display Station Interface (for simplified views)
 */
export interface DisplayStation {
  id: string;
  name: string;
  distance: number;
  type: string;
  price: number;
  slot: number;
}

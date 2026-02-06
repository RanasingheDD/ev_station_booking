// src/services/station_service.tsx
import axios from "axios";
import { API_URL } from "../config/api_config";
import type { Station, Charger } from "../models/station_model";

// Get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================

export interface DisplayStation {
  id: string;
  name: string;
  distance: number;
  type: string;
  price: number;
  slot: number;
}

/**
 * LEGACY: Fetch stations (kept for backward compatibility)
 * Used by EVHubStations and other existing components
 */
export const fetchStations = async (): Promise<DisplayStation[]> => {
  try {
    const res = await axios.get(API_URL + "/ev_stations/all");

    return res.data.map((station: Station) => {
      const chargers: Charger[] = (station.chargers || []).map((c) =>
        typeof c === "string" ? JSON.parse(c) : c
      );
      const firstCharger = chargers[0];

      return {
        id: station.id || "",
        name: station.name,
        distance: station.distance || 1.5, // TODO: calculate real distance
        type: firstCharger?.connectorType || "Unknown",
        price: firstCharger?.maxPowerKw
          ? parseFloat((firstCharger.maxPowerKw * 0.03).toFixed(2))
          : 0,
        slot: chargers.filter((c) => c.status?.toUpperCase() === "AVAILABLE")
          .length,
      };
    });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return [];
  }
};

/**
 * LEGACY: Get station by ID (kept for backward compatibility)
 */
export const getStationById = async (id: string): Promise<Station> => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_URL}/ev_stations/${id}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  const data = res.data;

  // Convert string → JSON object
  const parsedChargers = (data.chargers || [])
    .map((c: any) => {
      try {
        return typeof c === "string" ? JSON.parse(c) : c;
      } catch (error) {
        console.error("Invalid charger JSON:", c);
        return null;
      }
    })
    .filter(Boolean);

  return {
    ...data,
    images: data.images || [],
    chargers: parsedChargers,
    tariffRules: data.tariffRules || [],
    amenities: data.amenities || [],
  };
};

/**
 * LEGACY: Search stations by name (kept for backward compatibility)
 */
export const searchStations = async (
  query: string
): Promise<DisplayStation[]> => {
  try {
    const res = await axios.get(API_URL + "/ev_stations/search", {
      params: { q: query },
    });

    // ✅ FIX: Extract stations array correctly
    const stations: Station[] = res.data.stations || [];

    return stations.map((station: Station) => {
      const chargers: Charger[] = (station.chargers || []).map((c) =>
        typeof c === "string" ? JSON.parse(c) : c
      );

      const firstCharger = chargers[0];

      return {
        id: station.id || "",
        name: station.name,

        // ✅ use backend distance if available
        distance: station.distance ?? 0,

        type: firstCharger?.connectorType || "Unknown",

        price: firstCharger?.maxPowerKw
          ? parseFloat((firstCharger.maxPowerKw * 0.03).toFixed(2))
          : 0,

        slot: chargers.filter(
          (c) => c.status?.toUpperCase() === "AVAILABLE"
        ).length,
      };
    });
  } catch (error) {
    console.error("Error searching stations:", error);
    return [];
  }
};

// ============================================
// NEW EXPORTS (for Owner Dashboard)
// ============================================

/**
 * Fetch all stations (returns full Station objects)
 */
export const fetchAllStations = async (): Promise<Station[]> => {
  try {
    const res = await axios.get(`${API_URL}/ev_stations/all`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching all stations:", error);
    throw error;
  }
};

/**
 * Fetch stations owned by current user
 */
export const fetchOwnerStations = async (ownerId: string): Promise<Station[]> => {
  try {
    const res = await axios.get(`${API_URL}/ev_stations/all`, {
      headers: getAuthHeader(),
    });
    // Filter by operatorId on frontend until backend endpoint is added
    return res.data.filter((station: Station) => station.operatorId === ownerId);
  } catch (error) {
    console.error("Error fetching owner stations:", error);
    throw error;
  }
};

/**
 * Create new station
 */
export const createStation = async (stationData: Partial<Station>): Promise<Station> => {
  try {
    const res = await axios.post(
      `${API_URL}/ev_stations/add`,
      stationData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating station:", error);
    throw error;
  }
};

/**
 * Update existing station
 * NOTE: This endpoint needs to be added to backend StationController
 */
export const updateStation = async (
  id: string,
  stationData: Partial<Station>
): Promise<Station> => {
  try {
    const res = await axios.put(
      `${API_URL}/ev_stations/${id}`,
      stationData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating station:", error);
    throw error;
  }
};

/**
 * Delete station
 * NOTE: This endpoint needs to be added to backend StationController
 */
export const deleteStation = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/ev_stations/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Error deleting station:", error);
    throw error;
  }
};

// ============================================
// ANALYTICS & STATS
// ============================================

/**
 * Calculate total earnings for owner's stations
 * This is a frontend calculation until backend provides this data
 */
export const calculateStationEarnings = (stations: Station[]): number => {
  // Mock calculation - replace with real booking/session data
  return stations.length * 82.5; // Average earnings per station
};

/**
 * Get active bookings count
 * NOTE: Needs booking endpoint from backend
 */
export const getActiveBookingsCount = async (): Promise<number> => {
  try {
    // This endpoint doesn't exist yet - returning mock data
    // TODO: Create backend endpoint GET /api/bookings/active/count
    return 8;
  } catch (error) {
    console.error("Error fetching active bookings:", error);
    return 0;
  }
};

/**
 * Get station statistics
 */
export const getStationStats = (stations: Station[]) => {
  const totalChargers = stations.reduce(
    (sum, station) => sum + (station.chargers?.length || 0),
    0
  );

  const availableChargers = stations.reduce(
    (sum, station) =>
      sum +
      (station.chargers?.filter((c) => c.status === "AVAILABLE").length || 0),
    0
  );

  const occupiedChargers = stations.reduce(
    (sum, station) =>
      sum +
      (station.chargers?.filter((c) => c.status === "OCCUPIED" || c.status === "CHARGING").length || 0),
    0
  );

  return {
    totalStations: stations.length,
    totalChargers,
    availableChargers,
    occupiedChargers,
    averageRating:
      stations.reduce((sum, s) => sum + (s.rating || 0), 0) / stations.length ||
      0,
  };
};

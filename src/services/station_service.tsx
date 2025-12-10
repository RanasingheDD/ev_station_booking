// src/services/station_service.ts
import axios from "axios";
import { API_URL } from "../config/api_config";
import type { Charger, Station } from "../models/station_model";

export interface DisplayStation {
  id: string;
  name: string;
  distance: number;
  type: string;
  price: number;
  slot: number;
}

export const fetchStations = async (): Promise<DisplayStation[]> => {
  try {
    const res = await axios.get(API_URL + "/ev_stations/all");

    return res.data.map((station: Station) => {
      const chargers: Charger[] = (station.chargers || []).map((c) =>
        typeof c === "string" ? JSON.parse(c) : c
      );
      const firstCharger = chargers[0];

      return {
        id: station.id,
        name: station.name,
        distance: 1.5, // TODO: calculate real distance
        type: firstCharger?.connectorType || "Unknown",
        price: firstCharger?.maxPowerKw
          ? parseFloat((firstCharger.maxPowerKw * 0.03).toFixed(2))
          : 0,
        slot: chargers.filter((c) => c.status.toUpperCase() === "AVAILABLE")
          .length,
      };
    });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return [];
  }
};

export const getStationById = async (id: string): Promise<Station> => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_URL}/ev_stations/${id}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  const data = res.data as Station;

  return {
    ...data,
    images: data.images || [],
    chargers: data.chargers || [],
    tariffRules: data.tariffRules || [],
    amenities: data.amenities || [],
  };
};

// src/services/station_service.ts
import axios from "axios";
import { API_URL } from "../config/api_config";

export interface Charger {
  _id: string;
  stationId: string;
  connectorType: string;
  maxPowerKw: number;
  status: string;
  name: string;
  portNumber: number;
}

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  chargers: string[]; // JSON strings
}

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
      const chargers: Charger[] = station.chargers.map((c) => JSON.parse(c));
      const firstCharger = chargers[0];

      return {
        id: station.id,
        name: station.name,
        distance: 1.5, // TODO: calculate real distance from user
        type: firstCharger?.connectorType || "Unknown",
        price: firstCharger?.maxPowerKw
          ? parseFloat((firstCharger.maxPowerKw * 0.03).toFixed(2))
          : 0,
        slot: chargers.filter((c) => c.status === "AVAILABLE").length,
      };
    });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return [];
  }
};

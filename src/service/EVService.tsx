import axios from "axios";
import { API_URL } from "../config/api_config";

export interface EV {
  id: string;
  make: string;
  model: string;
  year: number;
  batteryKwh: number;
  maxChargeKw: number;
  connectorTypes: string[];
  nickname: string;
  licensePlate: string;
}

export const loadEVs = async () => {
  const res = await axios.get(`${API_URL}/users/evs`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.data.evs; // IMPORTANT
};

export const addEV = async (ev: Omit<EV, "id">): Promise<EV | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post<EV>(
      `${API_URL}/users/evs`,
      ev,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Axios automatically parses JSON
  } catch (err: any) {
    // Axios error handling
    if (err.response) {
      console.error("Server responded with error:", err.response.data);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Error setting up request:", err.message);
    }
    return null;
  }
};

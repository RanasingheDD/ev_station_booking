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

export const loadEVs = async (): Promise<EV[]> => {
  const res = await axios.get(`${API_URL}/users/evs`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data.evs;
};

export const addEV = async (ev: Omit<EV, "id">): Promise<EV | null> => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post<EV>(`${API_URL}/users/evs`, ev, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

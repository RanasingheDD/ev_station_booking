// utils/getPublicIP.ts
import axios from "axios";

export const getPublicIP = async (): Promise<string> => {
  try {
    const res = await axios.get("https://api.ipify.org?format=json");
    return res.data.ip; // e.g., "203.0.113.42"
  } catch {
    return "Unknown IP";
  }
};

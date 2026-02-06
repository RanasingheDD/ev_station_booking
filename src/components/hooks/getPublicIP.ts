// utils/getPublicIP.ts
export const getPublicIP = async (): Promise<string> => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip; // e.g., "203.0.113.42"
  } catch {
    return "Unknown IP";
  }
};

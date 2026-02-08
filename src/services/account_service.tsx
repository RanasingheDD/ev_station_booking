import axios from "axios";
import { API_URL } from "../config/api_config";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchCurrentUser = async () => {
  const res = await axios.get(`${API_URL}/users/me`, { headers: authHeader() });
  return res.data;
};

export const updateUserProfile = async (data: any) => {
  await axios.put(`${API_URL}/users/me`, data, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
};

export const fetchSessions = async (username: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/sessions/sessions/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const logoutSession = async (sessionId: string) => {
  await axios.delete(`${API_URL}/sessions/${sessionId}`, { headers: authHeader() });
};

export const deleteAccountService = async () => {
  await axios.delete(`${API_URL}/users/me`, { headers: authHeader() });
};

export const fetchUserWithPoints = async () => {
  const res = await axios.get(`${API_URL}/users/me`, { headers: authHeader() });
  return res.data;
};

export const fetchUserPoints = async () => {
  const res = await axios.get(`${API_URL}/users/me/points`, { headers: authHeader() });
  return res.data;
};

// ➕ Add points (for purchase)
export const addPointsService = async (amount: number, price: number) => {
  const res = await axios.post(
    `${API_URL}/users/me/points/add`,
    { amount, price },
    { headers: { "Content-Type": "application/json", ...authHeader() } }
  );
  return res.data;
};

// ➖ Deduct points (for booking)
export const deductPointsService = async (points: number) => {
  const res = await axios.post(
    `${API_URL}/users/me/points/deduct`,
    { points },
    { headers: { "Content-Type": "application/json", ...authHeader() } }
  );
  return res.data;
};

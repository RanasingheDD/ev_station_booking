import axios from 'axios';
import { API_URL } from '../config/api_config';

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// --- STATS ---
export const fetchAdminStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`, getAuthHeaders());
    return response.data;
  } catch (e) {
    return { totalUsers: 0, totalStations: 0, totalRevenue: 0, pendingApprovals: 0 }; 
  }
};

// --- USERS ---
export const fetchAllUsers = async () => {
  try {
     const response = await axios.get(`${API_URL}/admin/users`, getAuthHeaders());
     return response.data;
  } catch (e) {
     return [];
  }
};

export const registerOwner = async (ownerData: any) => {
  const response = await axios.post(`${API_URL}/admin/register-owner`, ownerData, getAuthHeaders());
  return response.data;
};

// --- STATIONS ---
export const fetchAllStations = async () => {
  const response = await axios.get(`${API_URL}/admin/stations`, getAuthHeaders());
  return response.data;
};

export const fetchDeleteRequests = async () => {
  const response = await axios.get(`${API_URL}/admin/stations/delete-requests`, getAuthHeaders());
  return response.data;
};

export const confirmStationDelete = async (id: string) => {
  const response = await axios.delete(`${API_URL}/admin/stations/${id}/confirm`, getAuthHeaders());
  return response.data;
};

export const rejectStationDelete = async (id: string) => {
  const response = await axios.put(`${API_URL}/admin/stations/${id}/reject`, {}, getAuthHeaders());
  return response.data;
};

// --- ✅ NEW: MESSAGES ---
export const fetchMessages = async () => {
  const response = await axios.get(`${API_URL}/messages/all`, getAuthHeaders());
  return response.data;
};

export const deleteMessage = async (id: string) => {
  const response = await axios.delete(`${API_URL}/messages/${id}`, getAuthHeaders());
  return response.data;
};
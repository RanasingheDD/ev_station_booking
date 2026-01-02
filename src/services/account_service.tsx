import { API_URL } from "../config/api_config";

// 🔐 Auth header helper
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 👤 Get current user
export const fetchCurrentUser = async () => {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

// ✏️ Update profile
export const updateUserProfile = async (data: any) => {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
};

// 🖥 Get active sessions
export const fetchSessions = async () => {
  const res = await fetch(`${API_URL}/sessions`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
};

// 🚪 Logout device
export const logoutSession = async (sessionId: string) => {
  const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to logout device");
};

// ❌ Delete account
export const deleteAccountService = async () => {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete account");
};

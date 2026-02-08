import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;    // email
  role: string;   // "OWNER" or "USER"
  id: string;     // User ID (Safe to use this instead of localStorage!)
  exp: number;    // Expiration time
}

// 1. Get the whole token object
export const getDecodedToken = (): DecodedToken | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// 2. Get just the Role
export const getUserRole = (): string | null => {
  const decoded = getDecodedToken();
  return decoded?.role || null;
};

// 3. Get just the User ID (Optional helper)
export const getUserIdFromToken = (): string | null => {
  const decoded = getDecodedToken();
  return decoded?.id || null;
};

// 4. Check if expired
export const isTokenValid = (): boolean => {
  const decoded = getDecodedToken();
  if (!decoded) return false;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};
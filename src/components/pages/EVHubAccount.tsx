import React, { useState, useEffect } from "react";
import { Edit2, Bell, Search, Coins, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Snackbar, Alert } from "@mui/material";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSessionSocket } from "../hooks/useSessionSocket";
import { useUser } from "../../context/UserContext";
import BuyPointsModal from "../BuyPointsModal/BuyPointsModal";
import { usePoints } from "../hooks/usePoints";

import {
  fetchCurrentUser,
  updateUserProfile,
  fetchSessions,
  logoutSession,
  deleteAccountService,
} from "../../services/account_service";

interface UserDetails {
  name: string;
  email: string;
  mobile: string;
  avatar: string;
  location?: string;
}

interface DeviceSession {
  id: string;
  device: string;
  os: string;
  ip: string;
  lastActive: string;
}

const EVHubAccount: React.FC = () => {
  useAuth();
  const navigate = useNavigate();
  const { user } = useUser();

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");
  const [showBuyPoints, setShowBuyPoints] = useState(false);

  // points
  const {points} = usePoints();

  const [editForm, setEditForm] = useState({
    username: "",
    mobile: "",
    location: "",
  });

  const token = localStorage.getItem("token");
  

  // 👤 Load user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchCurrentUser();
        setUserDetails(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadUser();
  }, []);

  // 📍 Location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = res.data;
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.display_name;

        setUserDetails((prev) => (prev ? { ...prev, location: city } : prev));
        setEditForm((prev) => ({ ...prev, location: city }));
      } catch (err) {
        console.error("Reverse geocode error:", err);
      }
    });
  }, []);

  // 🖥 Load devices
  useEffect(() => {
    const loadDevices = async () => {
      if (!userDetails) return;
      try {
        const data = await fetchSessions(userDetails.email);
        setDevices(data);
        setCurrentDeviceId(data.currentDeviceId);
      } catch (err) {
        console.error(err);
      }
    };
    loadDevices();
  }, [userDetails]);

  // ✏️ Save profile
  const handleSaveProfile = async () => {
    if (!userDetails) return;

    const updated = { ...userDetails, ...editForm };
    setUserDetails(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setIsEditOpen(false);
    setOpenSnackbar(true);

    try {
      await updateUserProfile(editForm);
    } catch (err) {
      console.error(err);
    }
  };

  // 🚪 Logout device
  // const logoutDevice = async (id: string) => {
  //   try {
  //     await logoutSession(id);
  //     setDevices((prev) => prev.filter((d) => d.id !== id));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const logoutDevice = async (id: string) => {
    try {
      await logoutSession(id);
      // WebSocket will update devices automatically
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Delete account
  const deleteAccount = async () => {
    try {
      await deleteAccountService();
      localStorage.clear();
      navigate("/register");
    } catch (err) {
      console.error(err);
    }
  };

  const username = userDetails?.email || "";
  useSessionSocket(username, token, setDevices);

  const formatIP = (ip: string) => {
      if (!ip) return "Unknown IP";

      // Convert IPv6 loopback to IPv4
      if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") return "127.0.0.1";

      // Optionally truncate long IPv6
      if (ip.includes(":") && !ip.startsWith("127")) {
        return ip.split(":").slice(-2).join(":"); // shows only last 2 blocks
      }

      return ip;
    };

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading account...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col p-8 ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-gray-400">Pages / Account</p>
          <h1 className="text-4xl font-bold">Account</h1>
        </div>
        {/* <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#141a25] px-3 py-2 rounded-full">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm focus:outline-none"
            />
          </div>
          <Bell className="text-gray-400" />
        </div> */}
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Account */}
        <div className="bg-[#10141f] rounded-2xl p-6 relative w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 flex justify-between">
            My Account
            <Edit2
              size={18}
              className="text-gray-400 cursor-pointer hover:text-[#00d084]"
              onClick={() => setIsEditOpen(true)}
            />
          </h2>
          <div className="border-t border-gray-700 my-3"></div>

          <img
            src="/member.jpg"
            alt="User"
            className="w-60 h-60 rounded-full border border-gray-600 mb-4 mx-auto"
          />
          <p className="text-gray-500">Name</p>
          <p className="font-semibold">{userDetails.name}</p>

          <p className="text-gray-500">Email</p>
          <p className="font-semibold">{userDetails.email}</p>

          <p className="text-gray-500">Mobile</p>
          <p className="font-semibold">{userDetails.mobile}</p>
          <p className="text-gray-500">Location</p>
          <p className="font-semibold mb-4">
            {userDetails?.location || "Fetching location..."}
          </p>

          {/* Points Section */}
          <div className="border-t border-gray-700 my-4 pt-4">
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 mb-3">
              <p className="text-gray-500 text-sm mb-1">Available Points</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-400">
                  {points || 0}
                </span>
                <Coins className="text-green-400" size={24} />
              </div>
              <p className="text-gray-500 text-xs mt-2">
                1 Point = 1 LKR
              </p>
            </div>
            <button
              onClick={() => setShowBuyPoints(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <CreditCard size={18} />
              Buy Points
            </button>
          </div>
        </div>

        {/* Devices Logged In */}
        <div className="bg-[#10141f] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Active Devices</h2>

          <div className="space-y-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex justify-between items-center bg-[#141a25] p-4 rounded-lg"
              >
                <div>
                  <p className="text-sm text-gray-400">
                    {device.os} • {formatIP(device.ip)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last active: {new Date(device.lastActive).toLocaleString()}
                  </p>
                </div>

                {/* Hide logout button for current device */}
                {device.id !== currentDeviceId && (
                  <button
                    className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => logoutDevice(device.id)}
                  >
                    Logout
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#10141f] rounded-2xl p-6 border border-red-600">
        <h2 className="text-xl font-semibold text-red-400 mb-4">
          Danger Zone
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          Deleting your account will permanently remove all your data.
        </p>

        <button
          onClick={() => setIsDeleteOpen(true)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white"
        >
          Delete Account
        </button>
      </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#10141f] p-6 rounded-2xl w-96"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

              <div className="space-y-3">
                {/* Username */}
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your name"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  className="w-full bg-[#141a25] p-2 rounded text-gray-200 placeholder-gray-500 focus:outline-none"
                />

                {/* Email (usually readonly) */}
                {/* <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={editForm.email}
                  disabled
                  className="w-full bg-[#141a25] p-2 rounded text-gray-400 cursor-not-allowed focus:outline-none"
                /> */}

                {/* Mobile */}
                <input
                  type="text"
                  name="Mobile"
                  placeholder="Enter your mobile"
                  value={editForm.mobile}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mobile: e.target.value })
                  }
                  className="w-full bg-[#141a25] p-2 rounded text-gray-200 placeholder-gray-500 focus:outline-none"
                />

                {/* Address */}
                <input
                  type="text"
                  name="Address"
                  placeholder="Enter your address"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full bg-[#141a25] p-2 rounded text-gray-200 placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-[#00d084] text-black rounded-md font-semibold hover:bg-[#00b06f]"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen && (
          <motion.div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <motion.div className="bg-[#10141f] p-6 rounded-xl w-96">
              <h3 className="text-lg font-semibold text-red-400">
                Confirm Account Deletion
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                Type <b>DELETE</b> to confirm.
              </p>

              <input
                className="w-full bg-[#141a25] p-2 mt-3 rounded"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="Type DELETE to confirm"
              />

              <div className="flex justify-end mt-4 gap-3">
                <button onClick={() => setIsDeleteOpen(false)}>
                  Cancel
                </button>
                <button
                  disabled={deleteText !== "DELETE"}
                  onClick={deleteAccount}
                  className="bg-red-600 px-4 py-2 rounded disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        //onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          //onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>

      {/* Buy Points Modal */}
      <BuyPointsModal
        isOpen={showBuyPoints}
        onClose={() => setShowBuyPoints(false)}
        onSuccess={() => setShowBuyPoints(false)}
      />
    </div>
  );
};

export default EVHubAccount;

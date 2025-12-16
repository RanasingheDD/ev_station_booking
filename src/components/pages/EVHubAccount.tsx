import React, { useState, useEffect } from "react";
import { Edit2, Bell, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Snackbar, Alert } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface UserDetails {
  username: string;
  email: string;
  mobile: string;
  address: string;
  role: string;
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
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    location: "",
    mobile: ""
  });
  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        const res = await fetch("http://localhost:8080/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUserDetails(data);
      } catch (err) {
        console.error("Account load failed:", err);
      }
    };

    fetchUser();
  }, []);

  // Fetch real-time location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.display_name;

          setUserDetails((prev) => (prev ? { ...prev, location: city } : prev));
          setEditForm((prev) => ({ ...prev, location: city }));
        } catch (err) {
          console.error("Failed to fetch location:", err);
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/sessions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load devices");

        const data = await res.json();
        setDevices(data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      }
    };

    fetchDevices();
  }, []);

  const handleSaveProfile = async () => {
    if (!userDetails) return;

    const updatedUser = { ...userDetails, ...editForm };
    setUserDetails(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // persist locally
    setIsEditOpen(false);
    setOpenSnackbar(true);

    // Update backend
    try {
      const response = await fetch("http://localhost:8080/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        console.error("Backend update failed:", response.statusText);
      }
    } catch (err) {
      console.error("Failed to update backend:", err);
    }
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading your account...
      </div>
    );
  }


  const deleteAccount = async () => {
    try {
      await fetch("http://localhost:8080/api/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.clear();
      navigate("/register");
    } catch (err) {
      console.error("Account deletion failed");
    }
  };

  const logoutDevice = async (sessionId: string) => {
    try {
      await fetch(`http://localhost:8080/api/sessions/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setDevices((prev) => prev.filter((d) => d.id !== sessionId));
    } catch (err) {
      console.error("Failed to logout device:", err);
    }
  };


  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col p-8 ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-gray-400">Pages / Account</p>
          <h1 className="text-4xl font-bold">Account</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#141a25] px-3 py-2 rounded-full">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm focus:outline-none"
            />
          </div>
          <Bell className="text-gray-400" />
          <img
            src={userDetails.avatar || "/logo.png "}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-gray-600"
          />
        </div>
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
            src={userDetails.avatar}
            alt="User"
            className="w-60 h-60 rounded-full border border-gray-600 mb-4 mx-auto"
          />
          <p className="text-gray-500">Name</p>
          <p className="font-semibold">{userDetails.username}</p>

          <p className="text-gray-500">Email</p>
          <p className="font-semibold">{userDetails.email}</p>

          <p className="text-gray-500">Mobile</p>
          <p className="font-semibold">{userDetails.mobile}</p>
          <p className="text-gray-500">Location</p>
          <p className="font-semibold mb-2">
            {userDetails?.location || "Fetching location..."}
          </p>
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
                  <p className="font-semibold">{device.device}</p>
                  <p className="text-sm text-gray-400">
                    {device.os} • {device.ip}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last active: {device.lastActive}
                  </p>
                </div>

                <button
                  onClick={() => logoutDevice(device.id)}
                  className="text-red-400 hover:text-red-500 text-sm"
                >
                  Logout
                </button>
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
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EVHubAccount;

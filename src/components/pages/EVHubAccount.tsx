import React, { useState } from "react";
import { Edit2, Bell, Search, Lock, Trash2, Shield, Laptop } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Snackbar, Alert } from "@mui/material";

const EVHubAccount: React.FC = () => {
  const userDetails = {
    name: "Nathan Hill",
    location: "New York",
    dob: "05.01.1993",
    email: "nathan.hill@example.com",
    avatar: "https://i.pravatar.cc/100?img=1",
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const recentActivity = [
    { id: 1, action: "Logged in from Chrome on Windows", time: "2 hours ago" },
    { id: 2, action: "Changed password", time: "1 day ago" },
    { id: 3, action: "Claimed Cyber Monday offer", time: "3 days ago" },
  ];

  const devices = [
    { id: 1, device: "Windows 11 - Chrome", location: "Colombo, Sri Lanka", lastUsed: "2 hours ago", current: true },
    { id: 2, device: "Android - Chrome", location: "Kandy, Sri Lanka", lastUsed: "2 days ago", current: false },
    { id: 3, device: "MacOS - Safari", location: "Galle, Sri Lanka", lastUsed: "5 days ago", current: false },
  ];

  const suspiciousLogins = [
    { id: 1, location: "India", time: "3 days ago", detail: "Login attempt failed" },
  ];

  const handleSaveProfile = () => {
    setIsEditOpen(false);
    setOpenSnackbar(true); // Show interactive notification
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col p-8">
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
            src={userDetails.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-gray-600"
          />
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Account */}
        <div className="bg-[#10141f] rounded-2xl p-6 relative">
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
          <p className="font-semibold mb-2">{userDetails.name}</p>
          <p className="text-gray-500">Location</p>
          <p className="font-semibold mb-2">{userDetails.location}</p>
          <p className="text-gray-500">Date of Birth</p>
          <p className="font-semibold mb-2">{userDetails.dob}</p>
          <p className="text-gray-500">Email</p>
          <p className="font-semibold">{userDetails.email}</p>

          <button className="mt-6 bg-[#00d084] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#00b06f] transition block mx-auto">
            More Info
          </button>
        </div>

        {/* Activity + Subscription + Security */}
        <div className="bg-[#10141f] rounded-2xl p-6 lg:col-span-2 flex flex-col gap-6">
          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
            <div className="bg-[#141a25] rounded-xl p-4">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b border-gray-800 last:border-0"
                >
                  <span>{item.action}</span>
                  <span className="text-gray-500 text-sm">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Subscription Info</h2>
            <div className="bg-[#141a25] rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Current Plan</p>
                <p className="font-semibold text-lg">Premium Tier</p>
                <p className="text-gray-500 text-sm">Renews on: 25 Dec 2025</p>
              </div>
              <button className="bg-[#00d084] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#00b06f] transition">
                Upgrade
              </button>
            </div>
          </div>

          {/* Usage Stats Placeholder */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Usage Stats</h2>
            <div className="bg-[#141a25] rounded-xl h-48 flex items-center justify-center text-gray-500">
              [Chart Placeholder – Energy usage, discounts, etc.]
            </div>
          </div>

          {/* Security Dashboard */}
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center space-x-2">
              <Shield size={18} className="text-[#00d084]" />
              <span>Security Dashboard</span>
            </h2>
            <div className="bg-[#141a25] rounded-xl p-4 space-y-6">
              {/* Devices Logged In */}
              <div>
                <p className="text-gray-400 mb-2">Devices Logged In</p>
                <div className="space-y-2">
                  {devices.map((d) => (
                    <div
                      key={d.id}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        d.current
                          ? "bg-[#00d084]/10 border border-[#00d084]/30"
                          : "bg-[#0d111a]"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Laptop size={16} className="text-gray-400" />
                        <div>
                          <p className="font-semibold">{d.device}</p>
                          <p className="text-sm text-gray-500">
                            {d.location} • {d.lastUsed}
                          </p>
                        </div>
                      </div>
                      {d.current && (
                        <span className="text-[#00d084] text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suspicious Logins */}
              <div>
                <p className="text-gray-400 mb-2">Suspicious Logins</p>
                {suspiciousLogins.length > 0 ? (
                  suspiciousLogins.map((log) => (
                    <div
                      key={log.id}
                      className="bg-[#1b1f2a] border border-red-500/30 p-3 rounded-lg"
                    >
                      <p className="font-semibold text-red-400">
                        {log.location} - {log.detail}
                      </p>
                      <p className="text-gray-500 text-sm">{log.time}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No suspicious activity detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Security Settings</h2>
            <div className="space-y-4 bg-[#141a25] p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock size={18} className="text-gray-400" />
                  <p>Change Password</p>
                </div>
                <button className="text-[#00d084] hover:underline">Update</button>
              </div>

              {/* Delete Account */}
              <div className="border-t border-gray-700 pt-3">
                <div className="flex items-center justify-between text-red-500">
                  <div className="flex items-center space-x-2">
                    <Trash2 size={18} />
                    <p>Delete Account</p>
                  </div>
                  <button className="hover:underline">Remove</button>
                </div>
              </div>
            </div>
          </div>
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
                <input
                  type="text"
                  defaultValue={userDetails.name}
                  className="w-full bg-[#141a25] p-2 rounded text-gray-200 focus:outline-none"
                />
                <input
                  type="email"
                  defaultValue={userDetails.email}
                  className="w-full bg-[#141a25] p-2 rounded text-gray-200 focus:outline-none"
                />
                <input
                  type="text"
                  defaultValue={userDetails.location}
                  className="w-full bg-[#141a25] p-2 rounded text-gray-200 focus:outline-none"
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

      {/* Interactive Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EVHubAccount;

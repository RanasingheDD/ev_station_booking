import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { API_URL } from "../../config/api_config";
import { useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
  const navigate = useNavigate();

  function showNotification(message: string | null, type: string) {
    const box = document.createElement("div");
    box.className = "notification";
    box.style.background = type === "success" ? "#28a745" : "#dc3545";
    box.textContent = message;

    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3000);
  }

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    mobile: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.password.length < 8) {
      showNotification("Password must be at least 8 characters long!", "error");
      return;
    }

    setLoading(true);

    const payload = {
      name: form.username,
      email: form.email,
      password: form.password,
      address: form.address,
      mobile: Number(form.mobile),
      role: "USER",
      evIds: [],
    };

    try {
      const response = await fetch(API_URL + "/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showNotification("Registration successful!", "success");
        navigate("/login");
      } else if (response.status === 409) {
        showNotification("Email already exists!", "error");
      } else {
        showNotification("Registration failed!", "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Server error!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-10">
        <div className="bg-[#0E1424] p-10 rounded-2xl shadow-lg w-full max-w-md border border-[#1A2236]">
          <h1 className="text-green-400 font-bold text-3xl text-center mb-2">
            ⚡ EV HUB
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Create your EV Hub account
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Full Name
              </label>
              <div className="flex items-center bg-[#101726] p-3 rounded-lg">
                <User className="text-gray-500 mr-2" size={18} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  onChange={handleChange}
                  className="bg-transparent focus:outline-none text-white w-full"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Address
              </label>
              <div className="flex items-center bg-[#101726] p-3 rounded-lg">
                <User className="text-gray-500 mr-2" size={18} />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                  className="bg-transparent focus:outline-none text-white w-full"
                  required
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Mobile No
              </label>
              <div className="flex items-center bg-[#101726] p-3 rounded-lg">
                <User className="text-gray-500 mr-2" size={18} />
                <input
                  type="number"
                  name="mobile"
                  placeholder="0712345678"
                  onChange={handleChange}
                  className="bg-transparent focus:outline-none text-white w-full"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Username
              </label>
              <div className="flex items-center bg-[#101726] p-3 rounded-lg">
                <User className="text-gray-500 mr-2" size={18} />
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe123"
                  onChange={handleChange}
                  className="bg-transparent focus:outline-none text-white w-full"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Email</label>
              <div className="flex items-center bg-[#101726] p-3 rounded-lg">
                <Mail className="text-gray-500 mr-2" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className="bg-transparent focus:outline-none text-white w-full"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Password
              </label>
              <div className="flex items-center bg-[#101726] p-3 rounded-lg">
                <Lock className="text-gray-500 mr-2" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  minLength={8}
                  onChange={handleChange}
                  className="bg-transparent focus:outline-none text-white w-full"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors
                ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }
              `}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>

            {/* Login Link */}
            <p className="text-gray-400 text-sm text-center mt-3">
              Already have an account?{" "}
              <span
                className="text-green-400 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;

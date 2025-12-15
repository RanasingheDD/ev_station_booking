import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { API_URL } from "../../config/api_config";
import { useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
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

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

   const handleGoogleRegistration = () => {
  console.log("Google login clicked");
};
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      username: form.username,
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

            {/* Mobile No */}
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
                  onChange={handleChange}
                  className="bg-transparent focus:outline-none text-white w-full"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white py-3 rounded-lg font-semibold"
            >
              Register
            </button>

             {/* Or Divider */}
            <div className="flex items-center justify-center text-gray-500 text-sm">
              <span className="border-b border-gray-500 w-1/4"></span>
              <span className="px-2">or</span>
              <span className="border-b border-gray-500 w-1/4"></span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleRegistration}
              className="w-full flex items-center justify-center border border-gray-500 hover:bg-gray-700 transition-colors text-white py-3 rounded-lg font-semibold"
            >
              <img
                src="/google-icon.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>


             {/* Signup Link */}
            <p className="text-gray-400 text-sm text-center mt-3">
              I have an account{" "}
              <span
                className="text-green-400 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>

      <footer className="bg-white/5 py-3 flex justify-center items-center">
        <p className="text-white text-sm font-medium">
          © <span className="text-green-400 font-semibold">NextGen</span>
        </p>
      </footer>
    </div>
  );
};

export default Registration;

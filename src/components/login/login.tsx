import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api_config";

export default function Login(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";
  
  const handleGoogleLogin = () => {
  console.log("Google login clicked");
};


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      // Save user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);

      
      // Redirect to previous page or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      alert("Login failed! Check your email/password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-10">
        <div className="bg-[#0E1424] p-10 rounded-2xl shadow-lg w-full max-w-md border border-[#1A2236]">
          <h1 className="text-green-400 font-bold text-3xl text-center mb-2 flex justify-center items-center">
            ⚡ EV HUB
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Login to your EV Hub account
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="text-gray-300 text-sm block mb-2">Email</label>
              <div className="flex items-center bg-[#101726] p-3 rounded-lg">
                <Mail className="text-gray-500 mr-2" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-transparent focus:outline-none text-white w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Password
              </label>
              <div className="flex items-center bg-[#101726] p-3 rounded-lg">
                <Lock className="text-gray-500 mr-2" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent focus:outline-none text-white w-full"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white py-3 rounded-lg font-semibold"
            >
              Login
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
              onClick={handleGoogleLogin}
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
              Don’t have an account?{" "}
              <span
                className="text-green-400 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

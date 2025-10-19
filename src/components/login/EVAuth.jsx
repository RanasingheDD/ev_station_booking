import React from "react";
import { Lock, Mail } from "lucide-react";

export default function Login() {

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6">
      <div className="bg-[#0E1424] p-10 rounded-2xl shadow-lg w-full max-w-md border border-[#1A2236]">
        <h1 className="text-green-400 font-bold text-3xl text-center mb-6">
          ⚡ EV HUB
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Login to your EV Hub account
        </p>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm block mb-2">Email</label>
            <div className="flex items-center bg-[#101726] p-3 rounded-lg">
              <Mail className="text-gray-500 mr-2" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                className="bg-transparent focus:outline-none text-white w-full"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm block mb-2">Password</label>
            <div className="flex items-center bg-[#101726] p-3 rounded-lg">
              <Lock className="text-gray-500 mr-2" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="bg-transparent focus:outline-none text-white w-full"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white py-3 rounded-lg font-semibold"
          >
            Sign In
          </button>

          {/* Footer Links */}
          <div className="flex justify-between text-sm mt-4 text-gray-400">
            <button
              type="button"
              onClick={() => alert("Password recovery feature coming soon!")}
              className="hover:text-green-400"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={() => alert("Sign-up coming soon!")}
              className="hover:text-green-400"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

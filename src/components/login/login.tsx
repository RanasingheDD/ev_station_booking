import React from 'react'
import { Mail, Lock } from "lucide-react"
import { useNavigate } from 'react-router-dom'

export default function Login(): React.ReactElement {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Dummy authentication for development
    localStorage.setItem('auth', 'true')

    // Redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-between">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-10">
        <div className="bg-[#0E1424] p-10 rounded-2xl shadow-lg w-full max-w-md border border-[#1A2236]">
          {/* Title */}
          <h1 className="text-green-400 font-bold text-3xl text-center mb-2 flex justify-center items-center">
            ⚡ EV HUB
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Login to your EV Hub account
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
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
              Login
            </button>

            {/* Footer Links */}
            <div className="flex justify-between text-sm mt-4 text-gray-400">
              <button
                type="button"
                onClick={() => alert('Password reset link will be added later')}
                className="hover:text-green-400"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="hover:text-green-400"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/5 py-3 flex justify-center items-center">
        <p className="text-white text-sm font-medium">
          © <span className="text-green-400 font-semibold">NextGen</span>
        </p>
      </footer>
    </div>
  )
}

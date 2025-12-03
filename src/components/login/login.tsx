import React, { useState } from 'react'
import { Mail, Lock } from "lucide-react"
// import { useNavigate } from 'react-router-dom'

export default function Login(): React.ReactElement {
  // const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error("Invalid credentials")

      const data = await response.json()

      

      // Save user info in localStorage
      localStorage.setItem("token", data.token)
      // navigate("/dashboard") // redirect to account/dashboard page
      window.location.href = "/dashboard"; 
    } catch (error) {
      console.error(error)
      alert("Login failed! Check your email/password.")
    }
  }

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
              <label className="text-gray-300 text-sm block mb-2">Password</label>
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
          </form>
        </div>
      </div>
    </div>
  )
}

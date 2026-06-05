import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await api.post("/auth/login", { email, password });
      navigate("/tasks");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-1">
            Login to manage your tasks
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg bg-[#0b1220] border border-gray-700 text-white outline-none focus:border-gray-400 transition"
          />

          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-[#0b1220] border border-gray-700 text-white outline-none focus:border-gray-400 transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full mt-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-5">
          Secure task management dashboard
        </p>
      </div>
    </div>
  );
}
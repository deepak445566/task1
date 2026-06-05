import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-white">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-lg"></div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-gray-300 text-sm mt-1">
            Login to continue your journey
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-400 outline-none text-white placeholder-gray-300 transition"
          />

          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-400 outline-none text-white placeholder-gray-300 transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-[1.02] active:scale-95 transition duration-200 shadow-lg"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-pink-400 font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-lg">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">
            Login to manage your tasks
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black outline-none"
          />

          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black outline-none"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full mt-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition"
        >
          Login
        </button>

        {/* Create Account Link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-black font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
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

      <div className="w-full max-w-md bg-white border border-black/10 rounded-2xl p-8 shadow-lg">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Login to access your dashboard
          </p>
        </div>

     
        <div className="space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg border border-black/20 bg-white text-black placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
          />

          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-black/20 bg-white text-black placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full mt-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 active:scale-[0.98] transition"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-black font-medium hover:underline">
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
}
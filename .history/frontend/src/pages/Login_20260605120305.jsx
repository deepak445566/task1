import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/login", { email, password });

      navigate("/tasks");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Login to access your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
          />

          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full mt-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
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
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    if (!name || !email || !password) {
      return "All fields are required";
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return "Enter a valid email";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  const handleRegister = async () => {
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    try {
      setError("");

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError("Registration failed. Try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-lg">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Start managing your tasks easily
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black outline-none"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black outline-none"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={!name || !email || !password}
          className="w-full mt-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
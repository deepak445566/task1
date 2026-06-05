import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    await api.post("/auth/register", {
      name,
      email,
      password,
    });
    navigate("/");
  };

  return (
    <div>
      <h2>Register</h2>
      <input onChange={(e) => setName(e.target.value)} placeholder="name" />
      <input onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
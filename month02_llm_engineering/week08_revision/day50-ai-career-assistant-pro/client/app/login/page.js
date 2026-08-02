"use client";

import { useState } from "react";

import api from "../../utils/api";

import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    loginUser(res.data);

    alert("Login successful");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Login</h1>

      <input
        className="border p-2 block mt-5"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 block mt-3"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-blue-600 text-white p-2 mt-5" onClick={submit}>
        Login
      </button>
    </div>
  );
}

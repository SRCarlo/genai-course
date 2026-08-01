"use client";

import { useState } from "react";

import api from "@/lib/api";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const res = await api.post(
      "/auth/login",

      form,
    );

    login(res.data);

    router.push("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back 👋</h1>

        <input
          className="input"
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button className="btn" onClick={submit}>
          Login
        </button>

        <p>
          New user?
          <a href="/signup">Create account</a>
        </p>
      </div>
    </div>
  );
}

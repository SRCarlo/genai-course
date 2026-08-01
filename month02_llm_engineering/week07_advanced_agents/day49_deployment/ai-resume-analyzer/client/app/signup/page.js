"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const res = await api.post("/auth/signup", form);

      console.log(res.data);

      setMessage("Account created successfully 🎉");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.log(error);

      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h1>Create Account 🚀</h1>

          <p>Start analyzing your resume with AI</p>
        </div>

        <input
          className="input"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,

              name: e.target.value,
            })
          }
        />

        <input
          className="input"
          placeholder="Email Address"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,

              email: e.target.value,
            })
          }
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,

              password: e.target.value,
            })
          }
        />

        <button
          className="btn"
          style={{
            width: "100%",
          }}
          onClick={handleSignup}
        >
          Create Account
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Already have an account?
          <a
            href="/login"
            style={{
              color: "#2563eb",
              marginLeft: "5px",
            }}
          >
            Login
          </a>
        </p>

        {message && (
          <p
            style={{
              textAlign: "center",
              color: "green",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

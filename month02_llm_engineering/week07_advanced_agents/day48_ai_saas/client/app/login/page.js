"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import API from "../../services/api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const response = await API.post(
        "/auth/login",

        {
          email,
          password,
        },
      );

      localStorage.setItem(
        "token",

        response.data.token,
      );

      router.replace("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
min-h-screen
flex
items-center
justify-center
bg-gray-100
"
    >
      <form
        onSubmit={handleLogin}
        className="
bg-white
shadow-xl
rounded-2xl
p-8
w-full
max-w-md
"
      >
        <h1
          className="
text-3xl
font-bold
mb-6
text-center
"
        >
          Welcome Back 👋
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
w-full
border
p-3
rounded-xl
mb-4
"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
w-full
border
p-3
rounded-xl
mb-4
"
        />

        {error && (
          <p
            className="
text-red-500
mb-4
"
          >
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="
text-center
mt-5
"
        >
          New user?
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="
text-blue-600
ml-2
"
          >
            Create Account
          </button>
        </p>
      </form>
    </div>
  );
}

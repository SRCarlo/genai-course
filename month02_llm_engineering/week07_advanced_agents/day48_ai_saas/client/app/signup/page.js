"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      await API.post(
        "/auth/signup",

        {
          name,
          email,
          password,
        },
      );

      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
        onSubmit={handleSignup}
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
          Create Account 🚀
        </h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
w-full
border
p-3
rounded-xl
mb-4
"
        />

        <input
          placeholder="Email"
          type="email"
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
          placeholder="Password"
          type="password"
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
          {loading ? "Creating..." : "Signup"}
        </button>

        <p
          className="
text-center
mt-5
text-gray-600
"
        >
          Already have account?
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="
text-blue-600
ml-2
"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

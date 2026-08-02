"use client";

import { useState } from "react";

import api from "../../utils/api";

export default function Signup() {
  const [form, setForm] = useState({});

  const submit = async () => {
    await api.post("/auth/signup", form);

    alert("Account created");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Create Account</h1>

      <input
        className="border p-2 block mt-5"
        placeholder="Name"
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        className="border p-2 block mt-3"
        placeholder="Email"
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        className="border p-2 block mt-3"
        placeholder="Password"
        type="password"
        onChange={(e) =>
          setForm({
            ...form,
            password: e.target.value,
          })
        }
      />

      <button className="bg-green-600 text-white p-2 mt-5" onClick={submit}>
        Signup
      </button>
    </div>
  );
}

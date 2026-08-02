"use client";

import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    api
      .get("/health")
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch(() => {
        setMessage("Server Not Running");
      });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-lg bg-white p-10 shadow-lg">
        <h1 className="mb-4 text-4xl font-bold text-blue-600">
          AI Career Assistant Pro
        </h1>

        <p className="text-lg font-medium">Backend Status:</p>

        <p className="mt-2 text-green-600">{message}</p>
      </div>
    </main>
  );
}

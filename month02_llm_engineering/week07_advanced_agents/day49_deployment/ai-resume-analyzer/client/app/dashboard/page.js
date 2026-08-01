/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        "/dashboard",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <h2>Please Login</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <h1 className="dashboard-title">Welcome back, {user.name} 👋</h1>

        <p>Manage your AI Resume Analyzer account</p>

        <div className="stat-grid">
          <div className="stat-card">
            <h3>Current Plan 💎</h3>

            <div className="stat-number">{user.plan || "FREE"}</div>
          </div>

          <div className="stat-card">
            <h3>AI Usage ⚡</h3>

            <div className="stat-number">{user.usage || 0}</div>

            <p>Requests used</p>
          </div>

          <div className="stat-card">
            <h3>Status 🟢</h3>

            <div className="stat-number">Active</div>
          </div>
        </div>

        <div
          className="card"
          style={{
            marginTop: "30px",
          }}
        >
          <h2>🚀 Analyze Resume</h2>

          <p>Upload your resume and get AI-powered feedback.</p>

          <button className="btn">Upload Resume</button>
        </div>
      </main>
    </div>
  );
}

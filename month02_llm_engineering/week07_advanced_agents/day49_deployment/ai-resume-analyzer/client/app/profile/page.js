/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import Sidebar from "@/components/Sidebar";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
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
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <h1 className="dashboard-title">My Profile 👤</h1>

        <div className="profile-card">
          <div className="avatar">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>

          <h2>{user.name}</h2>

          <p>{user.email}</p>

          <hr />

          <div className="profile-item">
            <strong>Plan:</strong>

            <span>{user.plan || "free"}</span>
          </div>

          <div className="profile-item">
            <strong>AI Usage:</strong>

            <span>
              {user.usage || 0}
              requests
            </span>
          </div>

          <button className="btn">Upgrade Plan 🚀</button>
        </div>
      </main>
    </div>
  );
}

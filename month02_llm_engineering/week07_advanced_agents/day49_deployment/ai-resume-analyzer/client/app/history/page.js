/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";

import api from "@/lib/api";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        "/history",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setHistory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <h1 className="dashboard-title">Resume History 📄</h1>

          <p>Your previous AI resume analysis reports</p>

          <div className="history-grid">
            {history.length === 0 ? (
              <div className="card">
                <h3>No history found</h3>

                <p>Upload a resume to start analysis.</p>
              </div>
            ) : (
              history.map((item, index) => (
                <div className="history-card" key={index}>
                  <div className="history-header">
                    <h3>Resume #{index + 1}</h3>

                    <span>{item.score || 85}%</span>
                  </div>

                  <p>{item.summary || "AI analysis completed successfully"}</p>

                  <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}

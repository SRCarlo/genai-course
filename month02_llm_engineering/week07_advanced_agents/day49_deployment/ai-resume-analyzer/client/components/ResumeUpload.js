"use client";

import { useState } from "react";

import api from "@/lib/api";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);

  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    const formData = new FormData();

    formData.append("resume", file);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/ai/analyze",

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "multipart/form-data",
          },
        },
      );

      setResult(res.data.analysis);
    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>📄 Upload Resume PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={uploadResume}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {result && (
        <div className="result">
          <h3>AI Analysis</h3>

          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

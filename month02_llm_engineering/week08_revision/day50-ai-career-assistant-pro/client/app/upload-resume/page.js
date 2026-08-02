"use client";

import { useState } from "react";

import api from "../../utils/api";

export default function UploadResume() {
  const [file, setFile] = useState(null);

  const [result, setResult] = useState(null);

  const upload = async () => {
    const formData = new FormData();

    formData.append("resume", file);

    const res = await api.post(
      "/resume/upload",

      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    setResult(res.data);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Upload Resume</h1>

      <input
        type="file"
        accept="application/pdf"
        className="mt-5"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="bg-blue-600 text-white p-3 mt-5" onClick={upload}>
        Upload & Analyze
      </button>

      {result && <pre className="mt-5">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

"use client";

import { useState } from "react";

import api from "../../utils/api";

export default function ResumeReview() {
  const [resume, setResume] = useState("");

  const [result, setResult] = useState(null);

  const review = async () => {
    const res = await api.post("/ai/resume-review", {
      resumeText: resume,
    });

    setResult(res.data.data);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">AI Resume Review</h1>

      <textarea
        className="border p-3 w-full mt-5"
        rows="10"
        placeholder="Paste resume here"
        onChange={(e) => setResume(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-5 py-2 mt-5"
        onClick={review}
      >
        Analyze Resume
      </button>

      {result && (
        <pre className="mt-5 bg-gray-100 p-5">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

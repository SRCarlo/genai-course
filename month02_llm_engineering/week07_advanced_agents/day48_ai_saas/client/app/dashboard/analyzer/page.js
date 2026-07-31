"use client";

import { useState } from "react";
import API from "../../../services/api";

export default function AnalyzerPage() {
  const [resume, setResume] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const analyze = async () => {
    try {
      setLoading(true);

      setError("");

      setResult(null);

      const response = await API.post(
        "/ai/analyze",

        {
          resumeText: resume,
        },
      );

      setResult(response.data);
    } catch (err) {
      console.log(err);

      setError("AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1
        className="
text-4xl
font-bold
mb-2
"
      >
        AI Resume Analyzer 🤖
      </h1>

      <p
        className="
text-gray-500
mb-8
"
      >
        Analyze your resume using AI
      </p>

      <div
        className="
bg-white
rounded-2xl
shadow
p-6
"
      >
        <h2
          className="
text-xl
font-bold
mb-4
"
        >
          Resume Content
        </h2>

        <textarea
          className="
w-full
h-60
border
rounded-xl
p-4
"
          placeholder="
Paste your resume here...
"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <button
          onClick={analyze}
          disabled={loading}
          className="
mt-5
bg-blue-600
text-white
px-8
py-3
rounded-xl
"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {error && (
        <div
          className="
mt-6
bg-red-100
text-red-700
p-4
rounded-xl
"
        >
          {error}
        </div>
      )}

      {result && (
        <div
          className="
mt-8
grid
md:grid-cols-2
gap-6
"
        >
          <div
            className="
bg-white
rounded-2xl
shadow
p-6
"
          >
            <h2
              className="
font-bold
text-xl
mb-3
"
            >
              Resume Score
            </h2>

            <p
              className="
text-5xl
font-bold
text-blue-600
"
            >
              {result.score || "85"}/100
            </p>
          </div>

          <div
            className="
bg-white
rounded-2xl
shadow
p-6
"
          >
            <h2
              className="
font-bold
text-xl
mb-3
"
            >
              Strengths
            </h2>

            <ul
              className="
list-disc
ml-5
"
            >
              {(result.strengths || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div
            className="
bg-white
rounded-2xl
shadow
p-6
"
          >
            <h2
              className="
font-bold
text-xl
mb-3
"
            >
              Weaknesses
            </h2>

            <ul
              className="
list-disc
ml-5
"
            >
              {(result.weaknesses || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div
            className="
bg-white
rounded-2xl
shadow
p-6
"
          >
            <h2
              className="
font-bold
text-xl
mb-3
"
            >
              Missing Skills
            </h2>

            <div
              className="
flex
flex-wrap
gap-3
"
            >
              {(result.skills || []).map((skill, index) => (
                <span
                  key={index}
                  className="
bg-blue-100
text-blue-700
px-4
py-2
rounded-full
"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div
            className="
bg-white
rounded-2xl
shadow
p-6
md:col-span-2
"
          >
            <h2
              className="
font-bold
text-xl
mb-3
"
            >
              Improvement Plan
            </h2>

            <p
              className="
text-gray-700
"
            >
              {result.suggestions ||
                "Improve projects, add measurable achievements and improve technical skills."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

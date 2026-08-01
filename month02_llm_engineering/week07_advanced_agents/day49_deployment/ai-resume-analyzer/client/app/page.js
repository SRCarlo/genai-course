import Link from "next/link";

export default function Home() {
  return (
    <div className="hero">
      <h1>
        AI Resume
        <span>Analyzer</span>
      </h1>

      <p>
        Analyze your resume with AI. Get skills, weaknesses and career
        improvement suggestions instantly.
      </p>

      <div>
        <Link href="/signup">
          <button className="btn">Get Started</button>
        </Link>
      </div>
    </div>
  );
}

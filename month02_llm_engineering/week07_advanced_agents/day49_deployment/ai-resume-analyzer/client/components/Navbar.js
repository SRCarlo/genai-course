"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };

  return (
    <nav className="navbar">
      <h2>AI Resume Analyzer 🚀</h2>

      <div>
        <Link href="/dashboard">Dashboard</Link>
        &nbsp;
        <Link href="/history">History</Link>
        &nbsp;
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

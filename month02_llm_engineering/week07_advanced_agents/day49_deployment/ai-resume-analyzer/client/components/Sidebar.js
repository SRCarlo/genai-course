"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };

  return (
    <aside className="sidebar">
      <div>
        <h2>🤖 Resume AI</h2>

        <nav>
          <Link href="/dashboard">Dashboard</Link>

          <Link href="/history">History</Link>

          <Link href="/profile">Profile</Link>
        </nav>
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const menu = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },

    {
      name: "AI Analyzer",
      url: "/dashboard/analyzer",
    },

    {
      name: "Billing",
      url: "/dashboard/billing",
    },

    {
      name: "Settings",
      url: "/dashboard/settings",
    },
  ];

  return (
    <aside
      className="
w-72
bg-slate-900
text-white
p-6
"
    >
      <h1
        className="
text-2xl
font-bold
mb-10
"
      >
        🚀 AI Resume AI
      </h1>

      {menu.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          className={`

block

px-5
py-3
rounded-xl
mb-3


${path === item.url ? "bg-blue-600" : "hover:bg-slate-700"}

`}
        >
          {item.name}
        </Link>
      ))}
    </aside>
  );
}

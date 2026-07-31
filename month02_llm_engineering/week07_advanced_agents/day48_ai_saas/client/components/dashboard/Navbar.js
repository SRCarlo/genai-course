"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");

    router.replace("/login");
  }

  return (
    <header
      className="
h-20
bg-white
shadow
flex
items-center
justify-between
px-8
"
    >
      <h2
        className="
font-bold
text-xl
"
      >
        AI SaaS Dashboard
      </h2>

      <button
        onClick={logout}
        className="
bg-red-500
text-white
px-5
py-2
rounded-xl
"
      >
        Logout
      </button>
    </header>
  );
}

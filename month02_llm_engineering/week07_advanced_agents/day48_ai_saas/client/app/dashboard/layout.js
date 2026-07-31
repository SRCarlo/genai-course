/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";
import Footer from "../../components/dashboard/Footer";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div
        className="
h-screen
flex
items-center
justify-center
"
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
flex
min-h-screen
bg-gray-100
"
    >
      <Sidebar />

      <div
        className="
flex-1
flex
flex-col
"
      >
        <Navbar />

        <main
          className="
flex-1
p-6
"
        >
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}

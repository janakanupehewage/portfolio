"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminNavBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Clear token
    router.push("/admin"); // Redirect to login
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h2 className="text-xl font-semibold">Admin Panel</h2>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminNavBar from "@/(components)/main/AdminNavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      if (pathname !== "/admin") {
        router.push("/admin");
      }
      setIsAuthenticated(false);
      return;
    }

    // Verify token using GraphQL API
    const verifyToken = async () => {
      const query = `
        query {
          testConnection
        }
      `;

      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query }),
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("adminToken");
          router.push("/admin");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("adminToken");
        router.push("/admin");
      }
    };

    verifyToken();
  }, [pathname]);

  if (isAuthenticated === null) {
    return <div className="text-center text-white mt-20">Checking authentication...</div>;
  }
  

  return (
    <div className="mb-[10px]">
      <AdminNavBar isAuthenticated={isAuthenticated} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
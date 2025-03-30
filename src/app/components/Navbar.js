"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { signOut } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="mb-6">
      <div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className={`text-xl font-bold ${
                  pathname === "/" ? "text-blue-600" : "text-gray-800"
                }`}
              >
                Todo App
              </Link>

              <div className="flex items-center space-x-4">
                <Link
                  href={pathname === "/dashboard" ? "/" : "/dashboard"}
                  className={`px-3 py-2 rounded-md ${
                    pathname === "/dashboard" || pathname === "/"
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-800"
                  } transition-colors`}
                >
                  {pathname === "/dashboard" ? "메인화면" : "대시보드"}
                </Link>
                <button
                  onClick={signOut}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

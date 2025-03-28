"use client";

import Link from "next/link";
import { useAuth } from "../../../lib/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <div className="w-full max-w-md mb-4">
      <nav className="bg-white px-6 py-4 rounded-xl shadow-lg flex justify-between items-center">
        <Link
          href="/"
          className="text-gray-800 text-2xl font-bold hover:text-gray-600 transition-colors duration-300"
        >
          ToDO
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={signOut}
                className="text-gray-800 hover:text-gray-600 transition-colors duration-300"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-gray-800 hover:text-gray-600 transition-colors duration-300"
              >
                로그인
              </Link>
              <Link
                href="/auth/signup"
                className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

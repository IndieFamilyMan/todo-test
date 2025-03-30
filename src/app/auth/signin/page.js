"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data, error } = await signIn(email, password);

      if (error) throw error;

      // 로그인 성공 시 메인 페이지로 리디렉션
      router.push("/");
    } catch (error) {
      console.error("로그인 오류:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
            <div className="mt-1 text-right">
              <Link
                href="/auth/reset-password"
                className="text-sm text-blue-500 hover:underline"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            계정이 없으신가요?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

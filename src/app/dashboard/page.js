"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import TodoDashboard from "../components/TodoDashboard";
import TodoCalendarView from "../components/TodoCalendarView";
import { fetchTodayStats } from "@/lib/todoService";

export default function DashboardPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [showStats, setShowStats] = useState(false);
  const [todayStats, setTodayStats] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    async function loadTodayStats() {
      if (isAuthenticated) {
        try {
          const { data, error } = await fetchTodayStats();
          if (error) throw error;
          setTodayStats(data);
        } catch (err) {
          console.error("오늘의 통계 로딩 오류:", err);
        }
      }
    }
    loadTodayStats();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">환영합니다!</h2>
              <p className="text-gray-600 mt-2">{user?.email}</p>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {showStats ? "통계 닫기" : "통계 확인"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <h2 className="text-sm font-medium text-blue-600 mb-1">
              {new Date().toLocaleDateString("ko-KR")}
            </h2>
            <h2 className="text-sm font-medium text-blue-600 mb-1">
              오늘의 통계
            </h2>
          </div>
          {todayStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600 mb-2">
                  전체 할 일
                </h3>
                <p className="text-2xl font-bold text-blue-800">
                  {todayStats.total}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-600 mb-2">
                  완료
                </h3>
                <p className="text-2xl font-bold text-green-800">
                  {todayStats.completed}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-600 mb-2">
                  진행중
                </h3>
                <p className="text-2xl font-bold text-yellow-800">
                  {todayStats.pending}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-600 mb-2">
                  완료율
                </h3>
                <p className="text-2xl font-bold text-purple-800">
                  {todayStats.completion_rate}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showStats ? (
        <TodoDashboard />
      ) : (
        <div className="grid gap-6">
          <TodoCalendarView />
        </div>
      )}
    </>
  );
}

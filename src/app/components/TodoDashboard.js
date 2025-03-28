"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { fetchMonthlyStats } from "@/lib/todoService";

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function TodoDashboard() {
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data, error } = await fetchMonthlyStats();
        if (error) throw error;
        setMonthlyStats(data || []);
      } catch (err) {
        setError("통계를 불러오는 중 오류가 발생했습니다.");
        console.error("통계 로딩 오류:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <div className="text-center p-4">로딩 중...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!monthlyStats.length)
    return <div className="text-center p-4">데이터가 없습니다.</div>;

  // 최근 6개월 데이터만 사용
  const recentStats = monthlyStats.slice(0, 6).reverse();

  const barChartData = {
    labels: recentStats.map((stat) =>
      new Date(stat.month).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "완료된 할 일",
        data: recentStats.map((stat) => stat.completed_todos),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "미완료 할 일",
        data: recentStats.map((stat) => stat.incomplete_todos),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "월별 할 일 현황",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // 가장 최근 월의 완료율을 도넛 차트로 표시
  const latestStat = recentStats[recentStats.length - 1];
  const doughnutData = {
    labels: ["완료", "미완료"],
    datasets: [
      {
        data: [latestStat.completed_todos, latestStat.incomplete_todos],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "이번 달 완료율",
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        할 일 통계 대시보드
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Bar data={barChartData} options={barChartOptions} />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div className="text-center mt-4">
            <p className="text-lg font-semibold">
              완료율: {latestStat.completion_rate}%
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">월</th>
                <th className="px-6 py-3">전체</th>
                <th className="px-6 py-3">완료</th>
                <th className="px-6 py-3">미완료</th>
                <th className="px-6 py-3">완료율</th>
              </tr>
            </thead>
            <tbody>
              {recentStats.map((stat) => (
                <tr key={stat.month} className="bg-white border-b">
                  <td className="px-6 py-4">
                    {new Date(stat.month).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                    })}
                  </td>
                  <td className="px-6 py-4">{stat.total_todos}</td>
                  <td className="px-6 py-4">{stat.completed_todos}</td>
                  <td className="px-6 py-4">{stat.incomplete_todos}</td>
                  <td className="px-6 py-4">{stat.completion_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

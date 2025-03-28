import { supabase } from "./supabaseClient";

const fetchMonthlyStats = async () => {
  try {
    const { data: todos, error: todosError } = await supabase
      .from("todos")
      .select("created_at, completed");

    if (todosError) throw todosError;

    // 월별 통계 계산
    const monthlyStats = todos.reduce((stats, todo) => {
      const date = new Date(todo.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!stats[monthKey]) {
        stats[monthKey] = {
          month: monthKey,
          total_todos: 0,
          completed_todos: 0,
          incomplete_todos: 0,
          completion_rate: 0,
        };
      }

      stats[monthKey].total_todos++;
      if (todo.completed) {
        stats[monthKey].completed_todos++;
      } else {
        stats[monthKey].incomplete_todos++;
      }

      return stats;
    }, {});

    // 완료율 계산 및 배열로 변환
    const result = Object.values(monthlyStats).map((stat) => {
      stat.completion_rate =
        Math.round((stat.completed_todos / stat.total_todos) * 100) || 0;
      return stat;
    });

    // 날짜순으로 정렬
    result.sort((a, b) => a.month.localeCompare(b.month));

    return { data: result, error: null };
  } catch (error) {
    console.error("통계 데이터 가져오기 오류:", error);
    return { data: null, error: "통계 데이터를 가져오는데 실패했습니다." };
  }
};

export { fetchMonthlyStats };

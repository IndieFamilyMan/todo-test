import { supabase } from "./supabaseClient";

// 모든 할 일 목록 가져오기
export async function fetchTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

// 새로운 할 일 추가
export async function addTodo(text) {
  const { data, error } = await supabase
    .from("todos")
    .insert([{ text, completed: false }])
    .select();

  return { data, error };
}

// 할 일 상태 토글
export async function toggleTodoStatus(id, completed) {
  const { data, error } = await supabase
    .from("todos")
    .update({ completed: !completed })
    .eq("id", id)
    .select();

  return { data, error };
}

// 할 일 삭제
export async function deleteTodo(id) {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  return { error };
}

// 할 일 텍스트 수정
export async function updateTodoText(id, text) {
  const { data, error } = await supabase
    .from("todos")
    .update({ text })
    .eq("id", id)
    .select();

  return { data, error };
}

// 월별 통계 가져오기
export const fetchMonthlyStats = async () => {
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

export async function fetchTodosByDate(date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching todos by date:", error);
    return { data: null, error };
  }
}

export async function fetchTodayStats() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    if (error) throw error;

    const stats = {
      total: data.length,
      completed: data.filter((todo) => todo.completed).length,
      pending: data.filter((todo) => !todo.completed).length,
      completion_rate:
        data.length > 0
          ? Math.round(
              (data.filter((todo) => todo.completed).length / data.length) * 100
            )
          : 0,
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error("오늘의 통계 가져오기 오류:", error);
    return { data: null, error };
  }
}

import { supabase } from "./supabaseClient";

/**
 * 사용자의 모든 할 일 목록을 가져옵니다.
 * @returns {Promise<{data: Array, error: Error}>} 할 일 목록 또는 오류
 */
export async function fetchTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * 새 할 일을 추가합니다.
 * @param {string} text - 할 일 내용
 * @returns {Promise<{data: Object, error: Error}>} 추가된 할 일 또는 오류
 */
export async function addTodo(text) {
  // user_id는 RLS(Row Level Security)로 인해 자동으로 현재 인증된 사용자의 ID로 설정됩니다.
  // Supabase는 insert 시 auth.uid() 함수를 통해 현재 사용자 ID에 접근합니다.
  // supabaseClient에서 생성된 클라이언트는 자동으로 현재 세션의 인증 토큰을 포함합니다
  const { data, error } = await supabase
    .from("todos")
    .insert([{ text }])
    .select();

  // 에러가 있는 경우 콘솔에 로깅
  if (error) {
    console.error("할 일 추가 중 오류:", error);
  }

  return { data, error };
}

/**
 * 할 일의 완료 상태를 토글합니다.
 * @param {number} id - 할 일 ID
 * @param {boolean} completed - 현재 완료 상태
 * @returns {Promise<{data: Object, error: Error}>} 업데이트된 할 일 또는 오류
 */
export async function toggleTodoStatus(id, completed) {
  const { data, error } = await supabase
    .from("todos")
    .update({ completed: !completed })
    .eq("id", id)
    .select();

  return { data, error };
}

/**
 * 할 일을 삭제합니다.
 * @param {number} id - 할 일 ID
 * @returns {Promise<{error: Error}>} 오류 객체
 */
export async function deleteTodo(id) {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  return { error };
}

/**
 * 할 일 내용을 수정합니다.
 * @param {number} id - 할 일 ID
 * @param {string} text - 새로운 할 일 내용
 * @returns {Promise<{data: Object, error: Error}>} 업데이트된 할 일 또는 오류
 */
export async function updateTodoText(id, text) {
  const { data, error } = await supabase
    .from("todos")
    .update({ text })
    .eq("id", id)
    .select();

  return { data, error };
}

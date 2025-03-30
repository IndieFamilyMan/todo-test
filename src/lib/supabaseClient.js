import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 회원가입 함수
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

// 이메일/비밀번호 로그인 함수
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

// 로그아웃 함수
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// 현재 사용자 정보 가져오기
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

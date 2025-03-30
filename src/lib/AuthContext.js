"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  supabase,
  getCurrentUser,
  signOut as supabaseSignOut,
} from "./supabaseClient";

// 인증 컨텍스트 생성
const AuthContext = createContext();

// 인증 제공자 컴포넌트
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 초기 사용자 상태 확인
  useEffect(() => {
    async function loadUser() {
      try {
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser || null);
      } catch (error) {
        console.error("사용자 정보 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    // 사용자 인증 상태 변경 이벤트 구독
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // 로그아웃 함수
  const signOut = async () => {
    try {
      await supabaseSignOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  // 인증이 필요한 페이지 접근 제한 함수
  const requireAuth = () => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
    return loading || !!user;
  };

  // 인증 상태 값
  const value = {
    user,
    loading,
    signOut,
    requireAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 인증 컨텍스트 사용을 위한 훅
export function useAuth() {
  return useContext(AuthContext);
}

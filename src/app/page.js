"use client";
// 클라이언트 컴포넌트로 선언
// Next.js에서 "use client" 지시문을 사용하는 이유를 설명해드리겠습니다.
// Next.js 13 이후 버전에서는 기본적으로 모든 컴포넌트가 서버 컴포넌트(Server Component)로 동작합니다. 하지만 우리가 만든 Todo 앱은 다음과 같은 클라이언트 측 기능들이 필요합니다:
// useState 훅 사용
// 사용자 이벤트 처리 (onClick, onChange)
// 브라우저 측 상태 관리
// 이러한 기능들은 서버 컴포넌트에서는 사용할 수 없고, 클라이언트 컴포넌트에서만 사용 가능합니다. 따라서 "use client" 지시문을 파일 최상단에 추가하여 이 컴포넌트가 클라이언트 컴포넌트임을 명시적으로 선언해야 합니다.
// 만약 "use client"를 선언하지 않으면 다음과 같은 에러가 발생할 수 있습니다:
// "useState is not defined"
// "Event handlers cannot be used in Server Components"
// 간단히 정리하면:
// 서버 컴포넌트 (기본값): 서버에서 렌더링되며, 상호작용이 필요 없는 정적인 컴포넌트
// 클라이언트 컴포넌트 ("use client" 사용): 브라우저에서 실행되며, 사용자 상호작용이 필요한 동적인 컴포넌트
// 우리의 Todo 앱은 사용자 입력과 상태 관리가 필요하므로 클라이언트 컴포넌트로 만들어야 합니다.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import TodoList from "./components/TodoList";

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, loading, router]);

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

  return <TodoList />;
}

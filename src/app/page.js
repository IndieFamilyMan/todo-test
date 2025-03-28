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

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "./components/Navbar";
import TodoList from "./components/TodoList";
import FloatingButton from "./components/FloatingButton";
import TodoModal from "./components/TodoModal";
import LoginModal from "./components/LoginModal";
import EditTodoModal from "./components/EditTodoModal";
import { useAuth } from "../../lib/AuthContext";
import {
  fetchTodos,
  addTodo,
  toggleTodoStatus,
  deleteTodo,
  updateTodoText,
} from "../../lib/todoService";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // 할 일 목록 불러오기
  useEffect(() => {
    if (isAuthenticated) {
      loadTodos();
    }
  }, [isAuthenticated]);

  async function loadTodos() {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await fetchTodos();

      if (error) throw error;
      setTodos(data || []);
    } catch (err) {
      console.error("할 일 목록을 불러오는 중 오류 발생:", err.message);
      setError("할 일 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * 새로운 할 일을 추가하는 함수
   * @param {string} todoText - 추가할 할 일 내용
   */
  const handleAddTodo = async (todoText) => {
    // 로그인 상태 확인
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    // 입력된 텍스트가 공백이 아닌 경우에만 추가
    if (todoText.trim() !== "") {
      try {
        setIsLoading(true);
        const { data, error } = await addTodo(todoText);

        if (error) {
          console.error(
            "할 일 추가 오류:",
            error.message,
            error.details,
            error.hint
          );
          alert(`할 일을 추가하는 중 오류가 발생했습니다: ${error.message}`);
          throw error;
        }

        if (data && data.length > 0) {
          setTodos([data[0], ...todos]);
        }
      } catch (err) {
        console.error("할 일 추가 중 오류 발생:", err.message, err);
        alert(`할 일을 추가하는 중 오류가 발생했습니다: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleTodo = async (id, completed) => {
    // 로그인 상태 확인
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await toggleTodoStatus(id, completed);

      if (error) throw error;

      // 로컬 상태 업데이트
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      console.error("할 일 상태 변경 중 오류 발생:", err.message);
      alert("할 일 상태를 변경하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (confirm("정말로 이 할 일을 삭제하시겠습니까?")) {
      try {
        setIsLoading(true);
        const { error } = await deleteTodo(id);

        if (error) throw error;

        // 로컬 상태에서 삭제된 할 일 제거
        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (err) {
        console.error("할 일 삭제 중 오류 발생:", err.message);
        alert("할 일을 삭제하는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 할 일 추가 버튼 클릭 시 실행되는 함수
  const handleAddButtonClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleEditTodo = (todo) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleUpdateTodo = async (id, text) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await updateTodoText(id, text);

      if (error) throw error;

      // 로컬 상태 업데이트
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
      );
    } catch (err) {
      console.error("할 일 수정 중 오류 발생:", err.message);
      alert("할 일을 수정하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중 상태 표시
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 relative">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-md bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 whitespace-pre-line">
          {isAuthenticated
            ? `${user?.email} 님의\n할 일 목록`
            : "할 일 관리 앱에 오신 것을\n 환영합니다!\n로그인이 필요합니다."}
        </h1>

        {!isAuthenticated && (
          <p className="mb-6 text-center text-gray-600">
            투두 앱 인터페이스를 둘러보세요! 할 일을 추가하거나 관리하려면
            로그인이 필요합니다.
          </p>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading && isAuthenticated && todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            할 일을 불러오는 중...
          </div>
        ) : (
          <TodoList
            todos={todos}
            toggleTodo={(id, completed) => toggleTodo(id, completed)}
            deleteTodo={handleDeleteTodo}
            editTodo={handleEditTodo}
            isAuthenticated={isAuthenticated}
          />
        )}

        <FloatingButton onClick={handleAddButtonClick} />

        <TodoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={(todoText) => {
            handleAddTodo(todoText);
            setIsModalOpen(false);
          }}
        />

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />

        <EditTodoModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTodo(null);
          }}
          onUpdate={(id, text) => {
            handleUpdateTodo(id, text);
            setIsEditModalOpen(false);
            setEditingTodo(null);
          }}
          todo={editingTodo}
        />
      </div>
    </div>
  );
}

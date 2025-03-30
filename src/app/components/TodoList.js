"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import FloatingButton from "./FloatingButton";
import AddTodoModal from "./AddTodoModal";
import EditTodoModal from "./EditTodoModal";
import {
  fetchTodos,
  addTodo,
  toggleTodoStatus,
  deleteTodo,
  updateTodoText,
} from "@/lib/todoService";

const CheckIcon = () => (
  <svg
    className="w-6 h-6 text-green-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const EmptyCheckIcon = () => (
  <svg
    className="w-6 h-6 text-gray-400"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-5 h-5 text-red-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

function TodoItem({ todo, toggleTodo, deleteTodo, editTodo, isAuthenticated }) {
  return (
    <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
      <button
        onClick={() => toggleTodo(todo.id, todo.completed)}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer"
        disabled={!isAuthenticated}
      >
        {todo.completed ? <CheckIcon /> : <EmptyCheckIcon />}
      </button>
      <span
        className={`flex-1 text-base ${
          todo.completed ? "line-through text-gray-600" : "text-gray-800"
        }`}
      >
        {todo.text}
      </span>
      {isAuthenticated && (
        <>
          <button
            onClick={() => editTodo(todo)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer text-blue-500 hover:text-blue-700"
            title="수정"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer text-red-500 hover:text-red-700"
            title="삭제"
          >
            <DeleteIcon />
          </button>
        </>
      )}
    </li>
  );
}

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

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

  const handleAddTodo = async (todoText) => {
    if (todoText.trim() !== "") {
      try {
        setIsLoading(true);
        const { data, error } = await addTodo(todoText);

        if (error) throw error;
        if (data && data.length > 0) {
          setTodos([data[0], ...todos]);
        }
      } catch (err) {
        console.error("할 일 추가 중 오류 발생:", err.message);
        alert("할 일을 추가하는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      setIsLoading(true);
      const { error } = await toggleTodoStatus(id, completed);

      if (error) throw error;
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
    if (confirm("정말로 이 할 일을 삭제하시겠습니까?")) {
      try {
        setIsLoading(true);
        const { error } = await deleteTodo(id);

        if (error) throw error;
        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (err) {
        console.error("할 일 삭제 중 오류 발생:", err.message);
        alert("할 일을 삭제하는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleUpdateTodo = async (id, text) => {
    try {
      setIsLoading(true);
      const { error } = await updateTodoText(id, text);

      if (error) throw error;
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

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  // 할 일이 없을 때 표시
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {isAuthenticated
          ? "할 일이 없습니다. 새로운 할 일을 추가해보세요!"
          : "로그인하면 할 일을 추가할 수 있습니다."}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {user?.email} 님의 할 일 목록
      </h1>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>
      )}

      {isLoading && todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          할 일을 불러오는 중...
        </div>
      ) : (
        <>
          {/* 진행중인 할 일 목록 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 px-2 text-gray-800">
              진행중 ({pendingTodos.length})
            </h2>
            {pendingTodos.length > 0 ? (
              <ul className="space-y-3">
                {pendingTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={handleDeleteTodo}
                    editTodo={handleEditTodo}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-center py-4 text-gray-500">
                완료되지 않은 할 일이 없습니다.
              </p>
            )}
          </div>

          {/* 완료된 할 일 목록 */}
          {completedTodos.length > 0 && (
            <div className="mb-16">
              <h2 className="text-lg font-semibold mb-3 px-2 text-gray-800">
                완료됨 ({completedTodos.length})
              </h2>
              <ul className="space-y-3">
                {completedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={handleDeleteTodo}
                    editTodo={handleEditTodo}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <FloatingButton onClick={() => setIsModalOpen(true)} />

      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTodo}
      />

      <EditTodoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        todo={editingTodo}
        onUpdate={(text) => {
          handleUpdateTodo(editingTodo.id, text);
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
}

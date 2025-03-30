"use client";

import { format, isValid } from "date-fns";
import { ko } from "date-fns/locale";

export default function CalendarTodoModal({ isOpen, onClose, date, todos }) {
  if (!isOpen) return null;

  const formatDate = (date) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (!isValid(dateObj)) return "날짜 정보 없음";
      return format(dateObj, "yyyy년 MM월 dd일", { locale: ko });
    } catch (error) {
      console.error("날짜 포맷 오류:", error);
      return "날짜 정보 없음";
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return "";
      return format(date, "HH:mm");
    } catch (error) {
      console.error("시간 포맷 오류:", error);
      return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{formatDate(date)}의 할 일</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {todos && todos.length > 0 ? (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-3 rounded-lg ${
                    todo.completed
                      ? "bg-green-50 line-through text-gray-500"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{todo.text}</span>
                    <span className="text-sm text-gray-500">
                      {formatTime(todo.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">
              이 날의 할 일이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

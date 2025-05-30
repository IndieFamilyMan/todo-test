"use client";

import { useState, useEffect } from "react";

export default function EditTodoModal({ isOpen, onClose, onUpdate, todo }) {
  const [inputValue, setInputValue] = useState("");

  // todo가 변경될 때마다 inputValue 업데이트
  useEffect(() => {
    if (todo) {
      setInputValue(todo.text);
    }
  }, [todo]);

  const handleUpdateTodo = () => {
    if (inputValue.trim() !== "" && todo) {
      onUpdate(todo.id, inputValue);
      setInputValue("");
    }
  };

  if (!isOpen || !todo) return null;

  return (
    <div
      className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full px-6 py-6 bg-white rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">할 일 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 border-gray-300 cursor-text"
            placeholder="할 일을 입력하세요"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={handleUpdateTodo}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function AddTodoModal({ isOpen, onClose, onAdd }) {
  const [todoText, setTodoText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoText.trim()) {
      onAdd(todoText);
      setTodoText("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">새로운 할 일 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              placeholder="할 일을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={!todoText.trim()}
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full px-6 py-6 bg-white rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">로그인 필요</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            할 일을 관리하려면 로그인이 필요합니다.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { isSameDay, startOfDay, format } from "date-fns";
import Calendar from "./Calendar";
import { fetchTodos } from "@/lib/todoService";
import CalendarTodoModal from "./TodoModal";
import { useAuth } from "@/lib/AuthContext";

export default function TodoCalendarView() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadTodos();
    } else {
      setTodos([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await fetchTodos();
      if (error) throw error;
      setTodos(data || []);
    } catch (err) {
      console.error("할 일 목록을 불러오는 중 오류 발생:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasTodoOnDate = (date) => {
    if (!todos || todos.length === 0 || !date) {
      return false;
    }

    return todos.some((todo) => {
      if (!todo.created_at) return false;
      return isSameDay(date, new Date(todo.created_at));
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const getTodosForDate = (date) => {
    if (!todos || todos.length === 0) return [];

    return todos.filter((todo) => {
      if (!todo.created_at) return false;
      return isSameDay(date, new Date(todo.created_at));
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto ">
      <Calendar onDateClick={handleDateClick} hasTodoOnDate={hasTodoOnDate} />
      {selectedDate && (
        <CalendarTodoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            loadTodos();
          }}
          date={selectedDate}
          todos={getTodosForDate(selectedDate)}
        />
      )}
    </div>
  );
}

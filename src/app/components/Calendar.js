"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ko } from "date-fns/locale";

export default function Calendar({ onDateClick, hasTodoOnDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weeks = [];
  let week = [];

  // 첫 주의 시작 부분을 빈 칸으로 채우기
  const startDay = monthStart.getDay();
  for (let i = 0; i < startDay; i++) {
    week.push(null);
  }

  // 날짜 채우기
  daysInMonth.forEach((day) => {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  });

  // 마지막 주의 나머지 부분을 빈 칸으로 채우기
  while (week.length < 7) {
    week.push(null);
  }
  weeks.push(week);

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    onDateClick(date);
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "yyyy년 MM월", { locale: ko })}
        </h2>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className="text-center py-2 text-sm font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`
                p-2 text-center cursor-pointer hover:bg-gray-100 rounded
                ${day && isSameDay(day, new Date()) ? "bg-blue-100" : ""}
                ${
                  day && selectedDate && isSameDay(day, selectedDate)
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : ""
                }
                ${
                  !day || !isSameMonth(day, currentDate)
                    ? "text-gray-300"
                    : "text-gray-700"
                }
              `}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex flex-col items-center justify-center h-10">
                <span className="text-sm">{day ? format(day, "d") : ""}</span>
                {day &&
                  typeof hasTodoOnDate === "function" &&
                  hasTodoOnDate(day) && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-1"></div>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

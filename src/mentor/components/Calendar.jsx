import React from "react";

const Calendar = ({ calendarDate, goToPrevMonth, goToNextMonth }) => {
  const daysInMonth = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayWeekday = calendarDate.getDay();
  const today = new Date();
  const isCurrentMonth =
    calendarDate.getMonth() === today.getMonth() &&
    calendarDate.getFullYear() === today.getFullYear();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {calendarDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors !rounded-button"
          >
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
          <button
            onClick={goToNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors !rounded-button"
          >
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayWeekday }).map((_, i) => (
          <div key={`blank-${i}`}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && day === today.getDate();
          return (
            <button
              key={day}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors relative
                ${isToday ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}
                !rounded-button`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

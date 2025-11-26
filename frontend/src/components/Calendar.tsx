import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Event } from '../App';
import { getCategoryClasses } from '../utils/categoryColors';

type CalendarProps = {
  events: Event[];
  onEventClick: (eventId: string) => void;
};

export function Calendar({ events, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const calendarDays = [];
  
  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="border border-gray-200 bg-gray-50 p-2 min-h-[120px]" />);
  }
  
  // Actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDate(day);
    calendarDays.push(
      <div key={day} className="border border-gray-200 bg-white p-2 min-h-[120px]">
        <div className="text-gray-700 mb-2">{day}</div>
        <div className="space-y-1">
          {dayEvents.map(event => {
            const catClasses = getCategoryClasses(event.category);
            return (
              <div
                key={event.id}
                onClick={() => onEventClick(event.id)}
                className={`text-sm px-2 py-1 rounded cursor-pointer transition-colors ${catClasses} hover:opacity-90`}
              >
                {event.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 scale-90 origin-top mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center gap-8 mb-8">
          <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <h2 className="text-gray-900 font-semibold text-3xl">
            {monthNames[month]} {year}
          </h2>
          
          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <div key={day} className="border border-gray-200 bg-gray-100 p-3 text-center text-gray-700">
              {day}
            </div>
          ))}
          {calendarDays}
        </div>
      </div>
    </div>
  );
}

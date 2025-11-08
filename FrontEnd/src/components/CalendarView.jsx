import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';

const CalendarView = ({ events = [], onDateClick, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Generate calendar days for the current month
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, events]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // First day of the week (Sunday = 0)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Last day of the week
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayEvents = getEventsForDate(current);
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: isSameDay(current, new Date()),
        events: dayEvents
      });
      current.setDate(current.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate || event.date || event.eventDate);
      return isSameDay(eventDate, date);
    });
  };

  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const formatEventTime = (event) => {
    const eventDate = new Date(event.startDate || event.date || event.eventDate);
    return eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventColor = (event, index) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {formatDate(currentDate)}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[120px] p-2 border border-gray-200 ${
              day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
            } ${day.isToday ? 'bg-teal-50 border-teal-300' : ''}`}
            onClick={() => onDateClick && onDateClick(day.date)}
          >
            <div className={`text-sm font-medium mb-1 ${
              day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
            } ${day.isToday ? 'text-teal-600' : ''}`}>
              {day.date.getDate()}
            </div>
            
            {/* Events for this day */}
            <div className="space-y-1">
              {day.events.slice(0, 3).map((event, eventIndex) => (
                <div
                  key={event.id || event._id || eventIndex}
                  className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getEventColor(event, eventIndex)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick && onEventClick(event);
                  }}
                  title={`${event.name || event.title} - ${formatEventTime(event)}`}
                >
                  <div className="truncate font-medium">
                    {event.name || event.title}
                  </div>
                  <div className="flex items-center text-xs opacity-75">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatEventTime(event)}
                  </div>
                </div>
              ))}
              {day.events.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {events.length} event{events.length !== 1 ? 's' : ''} this month
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-teal-100 border border-teal-200 rounded mr-2"></div>
              Today
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-2"></div>
              Other month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;


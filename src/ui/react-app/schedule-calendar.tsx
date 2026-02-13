/**
 * Schedule Calendar - Calendar view of visits and appointments
 */

import React, { useState, useEffect } from 'react';

export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visits, setVisits] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const getDaysInView = () => {
    // Generate calendar days based on view mode
    const days: Date[] = [];
    // Logic to generate days for current view
    return days;
  };

  const getVisitsForDay = (date: Date) => {
    return visits.filter((visit) => {
      const visitDate = new Date(visit.startAt);
      return visitDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="schedule-calendar">
      <header>
        <h1>Schedule</h1>
        <div className="controls">
          <button onClick={() => setCurrentDate(new Date())}>Today</button>
          <div className="view-mode">
            <button
              className={viewMode === 'day' ? 'active' : ''}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
            <button
              className={viewMode === 'week' ? 'active' : ''}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button
              className={viewMode === 'month' ? 'active' : ''}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
          </div>
          <button className="primary">+ Schedule Visit</button>
        </div>
      </header>

      <div className="calendar-grid">
        {getDaysInView().map((day) => (
          <div key={day.toISOString()} className="calendar-day">
            <div className="day-header">
              <span className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="day-number">{day.getDate()}</span>
            </div>
            <div className="day-visits">
              {getVisitsForDay(day).map((visit) => (
                <div key={visit.id} className={`visit-card status-${visit.status.toLowerCase()}`}>
                  <div className="visit-time">
                    {new Date(visit.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="visit-title">{visit.title}</div>
                  {visit.assignedUsers && visit.assignedUsers.length > 0 && (
                    <div className="visit-users">
                      {visit.assignedUsers.map((user: any) => (
                        <span key={user.id} className="user-badge">{user.firstName[0]}{user.lastName[0]}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

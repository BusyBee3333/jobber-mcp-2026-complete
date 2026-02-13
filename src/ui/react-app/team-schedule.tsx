/**
 * Team Schedule - View schedules for all team members
 */

import React, { useState, useEffect } from 'react';

export default function TeamSchedule() {
  const [users, setUsers] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getUserVisits = (userId: string) => {
    return visits.filter((visit) =>
      visit.assignedUsers?.some((u: any) => u.id === userId)
    );
  };

  return (
    <div className="team-schedule">
      <header>
        <h1>Team Schedule</h1>
        <div className="controls">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date((e.target as HTMLInputElement).value))}
          />
          <button className="primary">+ Schedule Visit</button>
        </div>
      </header>

      <div className="schedule-grid">
        {users.map((user) => {
          const userVisits = getUserVisits(user.id);
          return (
            <div key={user.id} className="user-schedule">
              <div className="user-header">
                <div className="user-avatar">{user.firstName[0]}{user.lastName[0]}</div>
                <div>
                  <h3>{user.firstName} {user.lastName}</h3>
                  <p className="visits-count">{userVisits.length} visits</p>
                </div>
              </div>
              <div className="visits-timeline">
                {userVisits.map((visit) => (
                  <div key={visit.id} className={`visit-item status-${visit.status.toLowerCase()}`}>
                    <div className="visit-time">
                      {new Date(visit.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(visit.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="visit-title">{visit.title}</div>
                    {visit.job && <div className="visit-job">Job #{visit.job.jobNumber}</div>}
                  </div>
                ))}
                {userVisits.length === 0 && (
                  <div className="empty-schedule">No visits scheduled</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

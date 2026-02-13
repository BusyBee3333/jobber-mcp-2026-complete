/**
 * Team Dashboard - Overview of team members and their activity
 */

import React, { useState, useEffect } from 'react';

export default function TeamDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [teamStats, setTeamStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    scheduledVisits: 0,
    completedVisits: 0,
  });

  return (
    <div className="team-dashboard">
      <h1>Team Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Team Members</h3>
          <p className="stat-value">{teamStats.totalUsers}</p>
        </div>
        <div className="stat-card active">
          <h3>Active</h3>
          <p className="stat-value">{teamStats.activeUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Scheduled Visits</h3>
          <p className="stat-value">{teamStats.scheduledVisits}</p>
        </div>
        <div className="stat-card success">
          <h3>Completed Visits</h3>
          <p className="stat-value">{teamStats.completedVisits}</p>
        </div>
      </div>

      <section className="team-members">
        <h2>Team Members</h2>
        <div className="user-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">{user.firstName[0]}{user.lastName[0]}</div>
              <div className="user-info">
                <h3>{user.firstName} {user.lastName}</h3>
                <p className="user-role">{user.role}</p>
                <p className="user-email">{user.email}</p>
                <span className={`badge ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

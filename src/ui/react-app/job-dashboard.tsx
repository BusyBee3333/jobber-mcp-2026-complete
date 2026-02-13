/**
 * Job Dashboard - Overview of all jobs with status breakdown
 */

import React, { useState, useEffect } from 'react';

interface JobStats {
  total: number;
  active: number;
  completed: number;
  late: number;
  requiresInvoicing: number;
}

export default function JobDashboard() {
  const [stats, setStats] = useState<JobStats>({
    total: 0,
    active: 0,
    completed: 0,
    late: 0,
    requiresInvoicing: 0,
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  useEffect(() => {
    // In a real implementation, this would call the MCP tools
    // For now, this is a UI template
  }, []);

  return (
    <div className="job-dashboard">
      <h1>Job Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card active">
          <h3>Active</h3>
          <p className="stat-value">{stats.active}</p>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <p className="stat-value">{stats.completed}</p>
        </div>
        <div className="stat-card late">
          <h3>Late</h3>
          <p className="stat-value">{stats.late}</p>
        </div>
        <div className="stat-card invoicing">
          <h3>Requires Invoicing</h3>
          <p className="stat-value">{stats.requiresInvoicing}</p>
        </div>
      </div>

      <div className="recent-jobs">
        <h2>Recent Jobs</h2>
        <table>
          <thead>
            <tr>
              <th>Job #</th>
              <th>Title</th>
              <th>Client</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.jobNumber}</td>
                <td>{job.title}</td>
                <td>{job.client.firstName} {job.client.lastName}</td>
                <td><span className={`status ${job.status.toLowerCase()}`}>{job.status}</span></td>
                <td>${job.total?.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

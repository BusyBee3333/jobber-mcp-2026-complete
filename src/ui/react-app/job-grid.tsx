/**
 * Job Grid - Searchable, filterable table of all jobs
 */

import React, { useState, useEffect } from 'react';

export default function JobGrid() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    'ALL',
    'ACTION_REQUIRED',
    'ACTIVE',
    'CANCELLED',
    'COMPLETED',
    'LATE',
    'REQUIRES_INVOICING',
  ];

  useEffect(() => {
    // Load jobs via MCP tools
  }, [statusFilter]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(filter.toLowerCase()) ||
    job.jobNumber.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="job-grid">
      <header>
        <h1>All Jobs</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search jobs..."
            value={filter}
            onChange={(e) => setFilter((e.target as HTMLInputElement).value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </header>

      <table className="data-table">
        <thead>
          <tr>
            <th>Job #</th>
            <th>Title</th>
            <th>Client</th>
            <th>Status</th>
            <th>Created</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.jobNumber}</td>
              <td>{job.title}</td>
              <td>{job.client.firstName} {job.client.lastName}</td>
              <td><span className={`badge status-${job.status.toLowerCase()}`}>{job.status}</span></td>
              <td>{new Date(job.createdAt).toLocaleDateString()}</td>
              <td>${job.total?.amount || 0}</td>
              <td>
                <button>View</button>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <div className="loading">Loading...</div>}
      {filteredJobs.length === 0 && !loading && (
        <div className="empty-state">No jobs found</div>
      )}
    </div>
  );
}

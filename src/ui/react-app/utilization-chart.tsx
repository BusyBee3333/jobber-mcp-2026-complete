/**
 * Utilization Chart - Team utilization analytics
 */

import React, { useState, useEffect } from 'react';

export default function UtilizationChart() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [report, setReport] = useState<any>(null);

  return (
    <div className="utilization-chart">
      <header>
        <h1>Team Utilization Report</h1>
        <div className="controls">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: (e.target as HTMLInputElement).value })}
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: (e.target as HTMLInputElement).value })}
          />
          <button className="primary">Generate Report</button>
        </div>
      </header>

      {report && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Hours</h3>
              <p className="stat-value">{report.totalHours.toFixed(1)}</p>
            </div>
            <div className="stat-card success">
              <h3>Billable Hours</h3>
              <p className="stat-value">{report.billableHours.toFixed(1)}</p>
            </div>
            <div className="stat-card">
              <h3>Non-Billable Hours</h3>
              <p className="stat-value">{report.nonBillableHours.toFixed(1)}</p>
            </div>
            <div className="stat-card">
              <h3>Utilization Rate</h3>
              <p className="stat-value">{report.utilizationRate.toFixed(1)}%</p>
            </div>
          </div>

          <section className="user-breakdown">
            <h2>Team Member Breakdown</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total Hours</th>
                  <th>Billable Hours</th>
                  <th>Non-Billable Hours</th>
                  <th>Utilization Rate</th>
                </tr>
              </thead>
              <tbody>
                {report.userBreakdown?.map((user: any) => (
                  <tr key={user.userId}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.totalHours.toFixed(1)}</td>
                    <td>{user.billableHours.toFixed(1)}</td>
                    <td>{user.nonBillableHours.toFixed(1)}</td>
                    <td>
                      <div className="utilization-bar">
                        <div
                          className="utilization-fill"
                          style={{ width: `${user.utilizationRate}%` }}
                        />
                        <span>{user.utilizationRate.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {!report && (
        <div className="empty-state">Select a date range and generate a report</div>
      )}
    </div>
  );
}

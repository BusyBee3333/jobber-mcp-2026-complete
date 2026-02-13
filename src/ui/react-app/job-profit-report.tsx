/**
 * Job Profit Report - Profitability analysis by job
 */

import React, { useState, useEffect } from 'react';

export default function JobProfitReport() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [report, setReport] = useState<any>(null);

  return (
    <div className="job-profit-report">
      <header>
        <h1>Job Profitability Report</h1>
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
              <h3>Total Revenue</h3>
              <p className="stat-value">${report.totalRevenue?.amount.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Total Costs</h3>
              <p className="stat-value">${report.totalCosts?.amount.toFixed(2)}</p>
            </div>
            <div className="stat-card success">
              <h3>Total Profit</h3>
              <p className="stat-value">${report.totalProfit?.amount.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Profit Margin</h3>
              <p className="stat-value">{report.profitMargin?.toFixed(1)}%</p>
            </div>
          </div>

          <section className="job-breakdown">
            <h2>Job Breakdown</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job #</th>
                  <th>Title</th>
                  <th>Revenue</th>
                  <th>Costs</th>
                  <th>Profit</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {report.jobBreakdown?.map((job: any) => (
                  <tr key={job.jobId}>
                    <td>{job.jobNumber}</td>
                    <td>{job.title}</td>
                    <td>${job.revenue.amount.toFixed(2)}</td>
                    <td>${job.costs.amount.toFixed(2)}</td>
                    <td className={job.profit.amount >= 0 ? 'positive' : 'negative'}>
                      ${job.profit.amount.toFixed(2)}
                    </td>
                    <td>{job.margin.toFixed(1)}%</td>
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

/**
 * Invoice Dashboard - Overview of invoicing metrics
 */

import React, { useState, useEffect } from 'react';

export default function InvoiceDashboard() {
  const [stats, setStats] = useState({
    totalSent: 0,
    paid: 0,
    overdue: 0,
    amountDue: 0,
    amountPaid: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);

  return (
    <div className="invoice-dashboard">
      <h1>Invoice Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sent</h3>
          <p className="stat-value">{stats.totalSent}</p>
        </div>
        <div className="stat-card success">
          <h3>Paid</h3>
          <p className="stat-value">{stats.paid}</p>
        </div>
        <div className="stat-card warning">
          <h3>Overdue</h3>
          <p className="stat-value">{stats.overdue}</p>
        </div>
        <div className="stat-card">
          <h3>Amount Due</h3>
          <p className="stat-value">${stats.amountDue.toFixed(2)}</p>
        </div>
        <div className="stat-card success">
          <h3>Amount Paid</h3>
          <p className="stat-value">${stats.amountPaid.toFixed(2)}</p>
        </div>
      </div>

      <section className="recent-invoices">
        <h2>Recent Invoices</h2>
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Amount Due</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.client.firstName} {invoice.client.lastName}</td>
                <td><span className={`badge status-${invoice.status.toLowerCase()}`}>{invoice.status}</span></td>
                <td>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}</td>
                <td>${invoice.total?.amount || 0}</td>
                <td>${invoice.amountDue?.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

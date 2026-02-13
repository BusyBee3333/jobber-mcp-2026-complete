/**
 * Quote Grid - List of all quotes with filtering
 */

import React, { useState, useEffect } from 'react';

export default function QuoteGrid() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const statusOptions = ['ALL', 'DRAFT', 'SENT', 'APPROVED', 'CHANGES_REQUESTED', 'CONVERTED', 'EXPIRED'];

  return (
    <div className="quote-grid">
      <header>
        <h1>Quotes</h1>
        <div className="controls">
          <select value={statusFilter} onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <button className="primary">+ New Quote</button>
        </div>
      </header>

      <table className="data-table">
        <thead>
          <tr>
            <th>Quote #</th>
            <th>Title</th>
            <th>Client</th>
            <th>Status</th>
            <th>Created</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td>{quote.quoteNumber}</td>
              <td>{quote.title}</td>
              <td>{quote.client.firstName} {quote.client.lastName}</td>
              <td><span className={`badge status-${quote.status.toLowerCase()}`}>{quote.status}</span></td>
              <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
              <td>${quote.total?.amount || 0}</td>
              <td>
                <button>View</button>
                {quote.status === 'DRAFT' && <button>Send</button>}
                {quote.status === 'APPROVED' && <button>Convert to Job</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

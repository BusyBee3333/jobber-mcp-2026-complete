/**
 * Request Inbox - Manage client requests
 */

import React, { useState, useEffect } from 'react';

export default function RequestInbox() {
  const [requests, setRequests] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const statusOptions = ['ALL', 'NEW', 'IN_PROGRESS', 'CONVERTED', 'CLOSED'];

  return (
    <div className="request-inbox">
      <header>
        <h1>Client Requests</h1>
        <div className="controls">
          <select value={statusFilter} onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <button className="primary">+ New Request</button>
        </div>
      </header>

      <div className="request-list">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <h3>{request.title}</h3>
              <span className={`badge status-${request.status.toLowerCase()}`}>{request.status}</span>
            </div>
            <p className="request-description">{request.description || 'No description'}</p>
            <div className="request-meta">
              {request.client && (
                <span className="client-name">
                  {request.client.firstName} {request.client.lastName}
                </span>
              )}
              <span className="request-date">
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="request-actions">
              <button>View</button>
              {request.status === 'NEW' && (
                <>
                  <button>Convert to Quote</button>
                  <button>Convert to Job</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="empty-state">No requests found</div>
      )}
    </div>
  );
}

/**
 * Client Grid - Searchable table of all clients
 */

import React, { useState, useEffect } from 'react';

export default function ClientGrid() {
  const [clients, setClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    // Load clients via MCP tools
  }, [showArchived]);

  const filteredClients = clients.filter((client) =>
    client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="client-grid">
      <header>
        <h1>Clients</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived((e.target as HTMLInputElement).checked)}
            />
            Show Archived
          </label>
          <button className="primary">+ New Client</button>
        </div>
      </header>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id}>
              <td>{client.firstName} {client.lastName}</td>
              <td>{client.companyName || '—'}</td>
              <td>{client.email || '—'}</td>
              <td>{client.phone || '—'}</td>
              <td>
                {client.isArchived ? (
                  <span className="badge archived">Archived</span>
                ) : (
                  <span className="badge active">Active</span>
                )}
              </td>
              <td>
                <button>View</button>
                <button>Edit</button>
                {!client.isArchived && <button>Archive</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

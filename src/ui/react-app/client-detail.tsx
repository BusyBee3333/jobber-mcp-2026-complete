/**
 * Client Detail - Detailed view of a single client
 */

import React, { useState, useEffect } from 'react';

interface ClientDetailProps {
  clientId: string;
}

export default function ClientDetail({ clientId }: ClientDetailProps) {
  const [client, setClient] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  useEffect(() => {
    // Load client details via MCP tools
  }, [clientId]);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="client-detail">
      <header>
        <h1>{client.firstName} {client.lastName}</h1>
        {client.companyName && <p className="company">{client.companyName}</p>}
        {client.isArchived && <span className="badge archived">Archived</span>}
      </header>

      <div className="client-info-grid">
        <section className="contact-info">
          <h2>Contact Information</h2>
          <dl>
            <dt>Email:</dt>
            <dd>{client.email || 'Not provided'}</dd>
            
            <dt>Phone:</dt>
            <dd>{client.phone || 'Not provided'}</dd>
            
            {client.billingAddress && (
              <>
                <dt>Billing Address:</dt>
                <dd>
                  {client.billingAddress.street1}<br />
                  {client.billingAddress.street2 && <>{client.billingAddress.street2}<br /></>}
                  {client.billingAddress.city}, {client.billingAddress.province} {client.billingAddress.postalCode}
                </dd>
              </>
            )}
          </dl>
        </section>

        <section className="properties">
          <h2>Properties</h2>
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              {property.isDefault && <span className="badge">Default</span>}
              <address>
                {property.address.street1}<br />
                {property.address.street2 && <>{property.address.street2}<br /></>}
                {property.address.city}, {property.address.province} {property.address.postalCode}
              </address>
            </div>
          ))}
        </section>
      </div>

      <section className="recent-jobs">
        <h2>Recent Jobs</h2>
        <table>
          <thead>
            <tr>
              <th>Job #</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.jobNumber}</td>
                <td>{job.title}</td>
                <td>{job.status}</td>
                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                <td>${job.total?.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/**
 * Job Detail - Detailed view of a single job
 */

import React, { useState, useEffect } from 'react';

interface JobDetailProps {
  jobId: string;
}

export default function JobDetail({ jobId }: JobDetailProps) {
  const [job, setJob] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [lineItems, setLineItems] = useState<any[]>([]);

  useEffect(() => {
    // Load job details via MCP tools
  }, [jobId]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-detail">
      <header>
        <h1>Job #{job.jobNumber} - {job.title}</h1>
        <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
      </header>

      <section className="job-info">
        <h2>Job Information</h2>
        <dl>
          <dt>Client:</dt>
          <dd>{job.client.firstName} {job.client.lastName}</dd>
          
          <dt>Description:</dt>
          <dd>{job.description || 'No description'}</dd>
          
          <dt>Created:</dt>
          <dd>{new Date(job.createdAt).toLocaleDateString()}</dd>
          
          <dt>Total:</dt>
          <dd>${job.total?.amount || 0} {job.total?.currency}</dd>
        </dl>
      </section>

      <section className="visits">
        <h2>Visits</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.title}</td>
                <td>{new Date(visit.startAt).toLocaleString()}</td>
                <td>{new Date(visit.endAt).toLocaleString()}</td>
                <td>{visit.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="line-items">
        <h2>Line Items</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice?.amount || 0}</td>
                <td>${item.total?.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

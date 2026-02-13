/**
 * Invoice Detail - Detailed view of a single invoice
 */

import React, { useState, useEffect } from 'react';

interface InvoiceDetailProps {
  invoiceId: string;
}

export default function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const [invoice, setInvoice] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="invoice-detail">
      <header>
        <h1>Invoice #{invoice.invoiceNumber}</h1>
        <span className={`badge status-${invoice.status.toLowerCase()}`}>{invoice.status}</span>
      </header>

      <section className="invoice-info">
        <h2>Invoice Information</h2>
        <dl>
          <dt>Client:</dt>
          <dd>{invoice.client.firstName} {invoice.client.lastName}</dd>
          
          <dt>Subject:</dt>
          <dd>{invoice.subject}</dd>
          
          <dt>Created:</dt>
          <dd>{new Date(invoice.createdAt).toLocaleDateString()}</dd>
          
          {invoice.dueDate && (
            <>
              <dt>Due Date:</dt>
              <dd>{new Date(invoice.dueDate).toLocaleDateString()}</dd>
            </>
          )}
          
          <dt>Subtotal:</dt>
          <dd>${invoice.subtotal?.amount || 0}</dd>
          
          <dt>Total:</dt>
          <dd>${invoice.total?.amount || 0}</dd>
          
          <dt>Amount Paid:</dt>
          <dd>${invoice.amountPaid?.amount || 0}</dd>
          
          <dt>Amount Due:</dt>
          <dd className="amount-due">${invoice.amountDue?.amount || 0}</dd>
        </dl>
      </section>

      <section className="payments">
        <h2>Payments</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{new Date(payment.paidOn).toLocaleDateString()}</td>
                <td>${payment.amount.amount}</td>
                <td>{payment.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <button className="primary">+ Record Payment</button>
      </section>

      <footer className="actions">
        {invoice.status === 'DRAFT' && <button className="primary">Send Invoice</button>}
        <button>Download PDF</button>
      </footer>
    </div>
  );
}

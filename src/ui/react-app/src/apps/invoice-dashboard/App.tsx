import { useState } from 'react';

export default function App() {
  const [invoices] = useState([
    { id: '1', invoiceNumber: 'INV-2001', subject: 'HVAC Service', client: 'ABC Corp', status: 'PAID', total: 5000, amountDue: 0 },
    { id: '2', invoiceNumber: 'INV-2002', subject: 'Maintenance', client: 'XYZ Inc', status: 'SENT', total: 1200, amountDue: 1200 },
    { id: '3', invoiceNumber: 'INV-2003', subject: 'Installation', client: 'John Smith', status: 'OVERDUE', total: 3500, amountDue: 3500 },
  ]);

  const statusColors: Record<string, string> = {
    PAID: 'bg-green-500',
    SENT: 'bg-blue-500',
    OVERDUE: 'bg-red-500',
    DRAFT: 'bg-gray-500',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Invoice Dashboard</h1>
        <p className="text-gray-400 mt-1">Track all invoices and payments</p>
      </header>
      <div className="p-6">
        <div className="grid gap-4">
          {invoices.map(invoice => (
            <div key={invoice.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-400">{invoice.invoiceNumber}</span>
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[invoice.status]} text-white`}>
                      {invoice.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{invoice.subject}</h3>
                  <p className="text-gray-400">{invoice.client}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${invoice.total}</div>
                  {invoice.amountDue > 0 && (
                    <div className="text-sm text-red-400">Due: ${invoice.amountDue}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

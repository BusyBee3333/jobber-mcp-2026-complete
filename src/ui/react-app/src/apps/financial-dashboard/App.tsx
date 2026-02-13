import { useState } from 'react';

export default function App() {
  const [metrics] = useState({
    totalRevenue: 125000,
    outstandingInvoices: 15000,
    paidInvoices: 110000,
    expenses: 35000,
    netProfit: 75000,
  });

  const [recentInvoices] = useState([
    { id: '1', number: 'INV-2001', client: 'ABC Corp', amount: 5000, status: 'PAID' },
    { id: '2', number: 'INV-2002', client: 'XYZ Inc', amount: 1200, status: 'OVERDUE' },
    { id: '3', number: 'INV-2003', client: 'John Smith', amount: 3500, status: 'SENT' },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <p className="text-gray-400 mt-1">Track revenue, expenses, and profitability</p>
      </header>
      <div className="p-6">
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-green-400">${metrics.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-yellow-400">${metrics.outstandingInvoices.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Paid</div>
            <div className="text-2xl font-bold text-blue-400">${metrics.paidInvoices.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Expenses</div>
            <div className="text-2xl font-bold text-red-400">${metrics.expenses.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Net Profit</div>
            <div className="text-2xl font-bold text-emerald-400">${metrics.netProfit.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-2">Invoice</th>
                <th className="pb-2">Client</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(invoice => (
                <tr key={invoice.id} className="border-b border-gray-700">
                  <td className="py-3 font-mono text-sm">{invoice.number}</td>
                  <td className="py-3">{invoice.client}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.status === 'PAID' ? 'bg-green-500' : invoice.status === 'OVERDUE' ? 'bg-red-500' : 'bg-blue-500'
                    } text-white`}>{invoice.status}</span>
                  </td>
                  <td className="py-3 text-right font-medium">${invoice.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

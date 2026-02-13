import { useState } from 'react';

export default function App() {
  const [clients] = useState([
    { id: '1', firstName: 'John', lastName: 'Smith', companyName: 'ABC Corp', email: 'john@abc.com', phone: '555-1234', totalJobs: 5, totalRevenue: 12500 },
    { id: '2', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: '555-5678', totalJobs: 3, totalRevenue: 7800 },
    { id: '3', firstName: 'Bob', lastName: 'Johnson', companyName: 'XYZ Inc', email: 'bob@xyz.com', phone: '555-9012', totalJobs: 8, totalRevenue: 24000 },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage all your clients</p>
      </header>
      <div className="p-6">
        <div className="grid gap-4">
          {clients.map(client => (
            <div key={client.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{client.companyName || `${client.firstName} ${client.lastName}`}</h3>
                  <p className="text-gray-400 text-sm mt-1">{client.email} • {client.phone}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">${client.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{client.totalJobs} jobs</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

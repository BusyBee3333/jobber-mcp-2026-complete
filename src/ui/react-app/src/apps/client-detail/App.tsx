import { useState } from 'react';

export default function App() {
  const [client] = useState({
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    companyName: 'ABC Corp',
    email: 'john@abc.com',
    phone: '555-1234',
    billingAddress: {
      street1: '123 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
    },
    jobs: [
      { id: '1', jobNumber: 'J-1001', title: 'HVAC Installation', status: 'ACTIVE', total: 5000 },
      { id: '2', jobNumber: 'J-1002', title: 'Maintenance', status: 'COMPLETED', total: 1200 },
    ],
    totalRevenue: 25000,
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">{client.companyName || `${client.firstName} ${client.lastName}`}</h1>
        <p className="text-gray-400 mt-1">{client.email} • {client.phone}</p>
      </header>
      <div className="p-6 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
            <div className="space-y-3">
              {client.jobs.map(job => (
                <div key={job.id} className="p-4 bg-gray-900 rounded flex justify-between">
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-gray-400">{job.jobNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-400">${job.total}</div>
                    <div className="text-xs text-gray-400">{job.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-4">
            <h2 className="text-xl font-semibold mb-4">Total Revenue</h2>
            <div className="text-3xl font-bold text-green-400">${client.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <div className="text-sm">
              <div>{client.billingAddress.street1}</div>
              <div>{client.billingAddress.city}, {client.billingAddress.province}</div>
              <div>{client.billingAddress.postalCode}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function App() {
  const [job] = useState({
    id: '1',
    jobNumber: 'J-1001',
    title: 'HVAC Installation',
    description: 'Complete HVAC system installation for commercial building',
    status: 'ACTIVE',
    client: {
      firstName: 'John',
      lastName: 'Smith',
      companyName: 'ABC Corp',
      email: 'john@abccorp.com',
      phone: '555-1234',
    },
    property: {
      address: {
        street1: '123 Main St',
        city: 'New York',
        province: 'NY',
        postalCode: '10001',
      },
    },
    visits: [
      { id: '1', title: 'Site Survey', startAt: '2024-02-15T09:00:00Z', status: 'COMPLETED' },
      { id: '2', title: 'Installation', startAt: '2024-02-20T08:00:00Z', status: 'SCHEDULED' },
    ],
    lineItems: [
      { id: '1', name: 'HVAC Unit', quantity: 1, unitPrice: { amount: 3500 }, total: { amount: 3500 } },
      { id: '2', name: 'Installation Labor', quantity: 8, unitPrice: { amount: 150 }, total: { amount: 1200 } },
    ],
    total: { amount: 4700, currency: 'USD' },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium">
                {job.status}
              </span>
            </div>
            <p className="text-gray-400">{job.jobNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">${job.total.amount.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Value</div>
          </div>
        </div>
      </header>

      <div className="p-6 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-300">{job.description}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Visits</h2>
            <div className="space-y-3">
              {job.visits.map(visit => (
                <div key={visit.id} className="flex items-center justify-between p-4 bg-gray-900 rounded">
                  <div>
                    <div className="font-medium">{visit.title}</div>
                    <div className="text-sm text-gray-400">{new Date(visit.startAt).toLocaleString()}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    visit.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'
                  } text-white`}>
                    {visit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Line Items</h2>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Unit Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {job.lineItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-700">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3">${item.unitPrice.amount}</td>
                    <td className="py-3 text-right font-medium">${item.total.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Client</h2>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-gray-400">Name</div>
                <div className="font-medium">{job.client.companyName || `${job.client.firstName} ${job.client.lastName}`}</div>
              </div>
              <div>
                <div className="text-gray-400">Email</div>
                <div className="font-medium">{job.client.email}</div>
              </div>
              <div>
                <div className="text-gray-400">Phone</div>
                <div className="font-medium">{job.client.phone}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Property</h2>
            <div className="text-sm">
              <div className="font-medium">{job.property.address.street1}</div>
              <div className="text-gray-400">
                {job.property.address.city}, {job.property.address.province} {job.property.address.postalCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

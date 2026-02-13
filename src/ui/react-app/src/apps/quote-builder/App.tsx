import { useState } from 'react';

export default function App() {
  const [lineItems, setLineItems] = useState([
    { id: '1', name: 'Service A', quantity: 1, unitPrice: 100 },
    { id: '2', name: 'Service B', quantity: 2, unitPrice: 50 },
  ]);

  const total = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Quote Builder</h1>
        <p className="text-gray-400 mt-1">Create and customize quotes</p>
      </header>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quote Title</label>
            <input
              type="text"
              className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
              placeholder="Enter quote title"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Client</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2">
              <option>Select client</option>
              <option>ABC Corp</option>
              <option>XYZ Inc</option>
            </select>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Line Items</h2>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-700">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3">${item.unitPrice}</td>
                    <td className="py-3 text-right">${item.quantity * item.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              Add Line Item
            </button>
          </div>
          <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
            <div className="text-2xl font-bold">Total: <span className="text-green-400">${total}</span></div>
            <button className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 font-medium">
              Create Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

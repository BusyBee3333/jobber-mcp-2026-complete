import { useState } from 'react';

export default function App() {
  const [expenses] = useState([
    { id: '1', description: 'Materials - HVAC Parts', amount: 450, category: 'Materials', date: '2024-02-10', user: 'Alice' },
    { id: '2', description: 'Fuel', amount: 75, category: 'Vehicle', date: '2024-02-12', user: 'Bob' },
    { id: '3', description: 'Tools', amount: 230, category: 'Equipment', date: '2024-02-14', user: 'Charlie' },
  ]);

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Expense Manager</h1>
            <p className="text-gray-400 mt-1">Track all business expenses</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-400">${total}</div>
            <div className="text-sm text-gray-400">Total Expenses</div>
          </div>
        </div>
      </header>
      <div className="p-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr className="text-left text-gray-400">
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">User</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id} className="border-t border-gray-700">
                  <td className="p-4">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-4">{expense.description}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-gray-900 rounded text-xs">{expense.category}</span></td>
                  <td className="p-4">{expense.user}</td>
                  <td className="p-4 text-right font-medium">${expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

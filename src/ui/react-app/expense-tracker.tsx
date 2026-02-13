/**
 * Expense Tracker - Track and manage expenses
 */

import React, { useState, useEffect } from 'react';

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    jobId: '',
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount.amount, 0);

  return (
    <div className="expense-tracker">
      <header>
        <h1>Expenses</h1>
        <div className="controls">
          <input
            type="date"
            placeholder="Start Date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: (e.target as HTMLInputElement).value })}
          />
          <input
            type="date"
            placeholder="End Date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: (e.target as HTMLInputElement).value })}
          />
          <button className="primary">+ New Expense</button>
        </div>
      </header>

      <div className="expense-summary">
        <h2>Total Expenses: ${totalExpenses.toFixed(2)}</h2>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>User</th>
            <th>Job</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.description}</td>
              <td>{expense.category || '—'}</td>
              <td>{expense.user ? `${expense.user.firstName} ${expense.user.lastName}` : '—'}</td>
              <td>{expense.job ? expense.job.jobNumber : '—'}</td>
              <td>${expense.amount.amount.toFixed(2)}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

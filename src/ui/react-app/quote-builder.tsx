/**
 * Quote Builder - Create and edit quotes
 */

import React, { useState } from 'react';

interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export default function QuoteBuilder() {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Math.random().toString(36),
        name: '',
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const handleSubmit = () => {
    // Create quote via MCP tools
  };

  return (
    <div className="quote-builder">
      <h1>Build Quote</h1>

      <section className="quote-info">
        <div className="form-group">
          <label>Quote Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
            placeholder="Enter quote title"
          />
        </div>

        <div className="form-group">
          <label>Client</label>
          <select value={clientId} onChange={(e) => setClientId((e.target as HTMLSelectElement).value)}>
            <option value="">Select a client...</option>
          </select>
        </div>
      </section>

      <section className="line-items">
        <div className="section-header">
          <h2>Line Items</h2>
          <button onClick={addLineItem}>+ Add Item</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateLineItem(item.id, 'name', (e.target as HTMLInputElement).value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => updateLineItem(item.id, 'description', (e.target as HTMLInputElement).value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat((e.target as HTMLInputElement).value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat((e.target as HTMLInputElement).value))}
                  />
                </td>
                <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                <td>
                  <button onClick={() => removeLineItem(item.id)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total">
          <strong>Total: ${calculateTotal().toFixed(2)}</strong>
        </div>
      </section>

      <footer className="actions">
        <button onClick={handleSubmit} className="primary">Save Quote</button>
        <button>Cancel</button>
      </footer>
    </div>
  );
}

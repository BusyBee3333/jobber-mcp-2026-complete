import { useState } from 'react';

export default function App() {
  const [fields, setFields] = useState([
    { id: '1', label: 'Customer Name', type: 'text', required: true },
    { id: '2', label: 'Service Date', type: 'date', required: true },
    { id: '3', label: 'Notes', type: 'textarea', required: false },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Form Builder</h1>
        <p className="text-gray-400 mt-1">Create custom forms for field data collection</p>
      </header>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-4">
              <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
              <div className="space-y-3">
                {fields.map(field => (
                  <div key={field.id} className="p-3 bg-gray-900 rounded flex justify-between items-center">
                    <div>
                      <div className="font-medium">{field.label}</div>
                      <div className="text-sm text-gray-400">{field.type} {field.required && '(Required)'}</div>
                    </div>
                    <button className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700">Remove</button>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Add Field</button>
            </div>
          </div>
          <div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="space-y-4">
                {fields.map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-2">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2" rows={3} />
                    ) : (
                      <input type={field.type} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

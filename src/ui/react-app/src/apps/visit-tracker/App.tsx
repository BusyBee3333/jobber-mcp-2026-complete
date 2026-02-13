import { useState, useEffect } from 'react';

interface Visit {
  id: string;
  title: string;
  jobTitle: string;
  jobId: string;
  clientName: string;
  address: string;
  startAt: string;
  endAt: string;
  status: 'SCHEDULED' | 'EN_ROUTE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTo: string[];
  notes?: string;
}

export default function VisitTracker() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisits([
        {
          id: '1',
          title: 'Initial Consultation',
          jobTitle: 'HVAC Installation',
          jobId: 'J-1234',
          clientName: 'John Doe',
          address: '123 Main St, New York, NY',
          startAt: '2024-02-15T09:00:00Z',
          endAt: '2024-02-15T10:00:00Z',
          status: 'COMPLETED',
          assignedTo: ['Mike Johnson'],
          notes: 'Discussed system requirements',
        },
        {
          id: '2',
          title: 'System Installation',
          jobTitle: 'HVAC Installation',
          jobId: 'J-1234',
          clientName: 'John Doe',
          address: '123 Main St, New York, NY',
          startAt: '2024-02-20T08:00:00Z',
          endAt: '2024-02-20T16:00:00Z',
          status: 'SCHEDULED',
          assignedTo: ['Mike Johnson', 'Sarah Smith'],
        },
        {
          id: '3',
          title: 'Emergency Repair',
          jobTitle: 'Plumbing Emergency',
          jobId: 'J-1235',
          clientName: 'Jane Wilson',
          address: '456 Oak Ave, Brooklyn, NY',
          startAt: '2024-02-15T13:00:00Z',
          endAt: '2024-02-15T15:00:00Z',
          status: 'IN_PROGRESS',
          assignedTo: ['Tom Brown'],
          notes: 'Leaking pipe in basement',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredVisits = filter === 'ALL' 
    ? visits 
    : visits.filter(v => v.status === filter);

  const updateStatus = (id: string, status: Visit['status']) => {
    setVisits(visits.map(v => v.id === id ? { ...v, status } : v));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Visit Tracker</h1>
        <p className="text-gray-400 mt-1">Track all scheduled and active visits</p>
      </header>

      <div className="p-6">
        <div className="mb-6 flex gap-2">
          {['ALL', 'SCHEDULED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded ${
                filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading visits...</div>
        ) : (
          <div className="grid gap-4">
            {filteredVisits.map(visit => (
              <div key={visit.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{visit.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        visit.status === 'SCHEDULED' ? 'bg-blue-900 text-blue-200' :
                        visit.status === 'EN_ROUTE' ? 'bg-purple-900 text-purple-200' :
                        visit.status === 'IN_PROGRESS' ? 'bg-yellow-900 text-yellow-200' :
                        visit.status === 'COMPLETED' ? 'bg-green-900 text-green-200' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {visit.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-1">
                      <span className="font-mono text-sm">{visit.jobId}</span> - {visit.jobTitle}
                    </p>
                    <p className="text-sm text-gray-400 mb-2">{visit.clientName}</p>
                    <p className="text-sm text-gray-500">{visit.address}</p>
                    {visit.notes && (
                      <p className="mt-2 text-sm text-gray-400 italic">{visit.notes}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-400 mb-1">
                      {new Date(visit.startAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-semibold">
                      {new Date(visit.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      {' - '}
                      {new Date(visit.endAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      {visit.assignedTo.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {visit.status === 'SCHEDULED' && (
                    <button
                      onClick={() => updateStatus(visit.id, 'EN_ROUTE')}
                      className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                    >
                      Mark En Route
                    </button>
                  )}
                  {visit.status === 'EN_ROUTE' && (
                    <button
                      onClick={() => updateStatus(visit.id, 'IN_PROGRESS')}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                    >
                      Start Visit
                    </button>
                  )}
                  {visit.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => updateStatus(visit.id, 'COMPLETED')}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      Complete Visit
                    </button>
                  )}
                  {visit.status !== 'COMPLETED' && visit.status !== 'CANCELLED' && (
                    <button
                      onClick={() => updateStatus(visit.id, 'CANCELLED')}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

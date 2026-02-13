import { useState, useEffect } from 'react';

interface Request {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'DECLINED';
  createdAt: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default function RequestInbox() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRequests([
        {
          id: '1',
          title: 'HVAC System Installation',
          description: 'Need new HVAC system installed in 3-bedroom home',
          clientName: 'Sarah Wilson',
          clientEmail: 'sarah@example.com',
          clientPhone: '555-0123',
          status: 'NEW',
          createdAt: '2024-02-15T10:30:00Z',
          priority: 'HIGH',
        },
        {
          id: '2',
          title: 'Plumbing Repair',
          description: 'Leaking pipe in basement, needs urgent attention',
          clientName: 'Mike Brown',
          clientEmail: 'mike@example.com',
          clientPhone: '555-0124',
          status: 'CONTACTED',
          createdAt: '2024-02-14T14:20:00Z',
          priority: 'HIGH',
        },
        {
          id: '3',
          title: 'Electrical Inspection',
          description: 'Annual electrical safety inspection',
          clientName: 'Emma Davis',
          clientEmail: 'emma@example.com',
          clientPhone: '555-0125',
          status: 'QUOTED',
          createdAt: '2024-02-13T09:15:00Z',
          priority: 'MEDIUM',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredRequests = filter === 'ALL' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const updateStatus = (id: string, status: Request['status']) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Request Inbox</h1>
        <p className="text-gray-400 mt-1">Manage incoming service requests</p>
      </header>

      <div className="p-6">
        <div className="mb-6 flex gap-2">
          {['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'CONVERTED', 'DECLINED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded ${
                filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading requests...</div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{request.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        request.priority === 'HIGH' ? 'bg-red-900 text-red-200' :
                        request.priority === 'MEDIUM' ? 'bg-yellow-900 text-yellow-200' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">{request.description}</p>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>{request.clientName}</span>
                      <span>•</span>
                      <span>{request.clientEmail}</span>
                      <span>•</span>
                      <span>{request.clientPhone}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-sm font-semibold mb-2 ${
                      request.status === 'NEW' ? 'text-blue-400' :
                      request.status === 'CONTACTED' ? 'text-yellow-400' :
                      request.status === 'QUOTED' ? 'text-purple-400' :
                      request.status === 'CONVERTED' ? 'text-green-400' :
                      'text-red-400'
                    }`}>
                      {request.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateStatus(request.id, 'CONTACTED')}
                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => updateStatus(request.id, 'QUOTED')}
                    className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                  >
                    Send Quote
                  </button>
                  <button
                    onClick={() => updateStatus(request.id, 'CONVERTED')}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                  >
                    Convert to Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

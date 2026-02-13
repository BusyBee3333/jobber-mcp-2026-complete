import { useState, useEffect } from 'react';

interface Job {
  id: string;
  jobNumber: string;
  title: string;
  status: string;
  client: {
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  total?: {
    amount: number;
    currency: string;
  };
  createdAt: string;
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data fetch
    setTimeout(() => {
      setJobs([
        {
          id: '1',
          jobNumber: 'J-1001',
          title: 'HVAC Installation',
          status: 'ACTIVE',
          client: { firstName: 'John', lastName: 'Smith', companyName: 'ABC Corp' },
          total: { amount: 5000, currency: 'USD' },
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          jobNumber: 'J-1002',
          title: 'Plumbing Repair',
          status: 'COMPLETED',
          client: { firstName: 'Jane', lastName: 'Doe' },
          total: { amount: 850, currency: 'USD' },
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredJobs = jobs.filter(job => 
    filter === 'ALL' || job.status === filter
  );

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-blue-500',
    COMPLETED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
    LATE: 'bg-orange-500',
    ACTION_REQUIRED: 'bg-yellow-500',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Job Board</h1>
        <p className="text-gray-400 mt-1">Manage all your active and completed jobs</p>
      </header>

      <div className="p-6">
        <div className="mb-6 flex gap-2">
          {['ALL', 'ACTIVE', 'COMPLETED', 'ACTION_REQUIRED', 'LATE'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-400 font-mono text-sm">{job.jobNumber}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[job.status]} text-white`}>
                        {job.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                    <p className="text-gray-400">
                      {job.client.companyName || `${job.client.firstName} ${job.client.lastName}`}
                    </p>
                  </div>
                  <div className="text-right">
                    {job.total && (
                      <div className="text-2xl font-bold text-green-400">
                        ${job.total.amount.toLocaleString()}
                      </div>
                    )}
                    <div className="text-sm text-gray-400 mt-1">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

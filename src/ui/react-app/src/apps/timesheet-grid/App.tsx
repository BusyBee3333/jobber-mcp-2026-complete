import { useState, useEffect } from 'react';

interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  jobTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  notes?: string;
  approved: boolean;
}

export default function TimesheetGrid() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEntries([
        {
          id: '1',
          userId: '1',
          userName: 'Mike Johnson',
          jobTitle: 'HVAC Installation',
          date: '2024-02-15',
          startTime: '09:00',
          endTime: '12:00',
          hours: 3,
          notes: 'Installed new unit',
          approved: true,
        },
        {
          id: '2',
          userId: '2',
          userName: 'Sarah Smith',
          jobTitle: 'Plumbing Repair',
          date: '2024-02-15',
          startTime: '10:00',
          endTime: '14:00',
          hours: 4,
          notes: 'Fixed leaking pipes',
          approved: false,
        },
        {
          id: '3',
          userId: '1',
          userName: 'Mike Johnson',
          jobTitle: 'Electrical Inspection',
          date: '2024-02-14',
          startTime: '13:00',
          endTime: '16:00',
          hours: 3,
          approved: true,
        },
        {
          id: '4',
          userId: '3',
          userName: 'Tom Brown',
          jobTitle: 'Service Call',
          date: '2024-02-14',
          startTime: '08:00',
          endTime: '11:30',
          hours: 3.5,
          notes: 'Emergency repair',
          approved: false,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredEntries = filter === 'ALL' 
    ? entries 
    : entries.filter(e => filter === 'APPROVED' ? e.approved : !e.approved);

  const totalHours = filteredEntries.reduce((sum, e) => sum + e.hours, 0);

  const toggleApproval = (id: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, approved: !e.approved } : e));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Timesheet Grid</h1>
        <p className="text-gray-400 mt-1">Track and approve team time entries</p>
      </header>

      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'APPROVED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status as typeof filter)}
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
          <div className="text-xl font-bold">
            Total Hours: {totalHours.toFixed(1)}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading timesheets...</div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-750 border-b border-gray-700">
                  <th className="text-left p-4 font-semibold">Employee</th>
                  <th className="text-left p-4 font-semibold">Job</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Time</th>
                  <th className="text-left p-4 font-semibold">Hours</th>
                  <th className="text-left p-4 font-semibold">Notes</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(entry => (
                  <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">{entry.userName}</td>
                    <td className="p-4">{entry.jobTitle}</td>
                    <td className="p-4">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-gray-400">
                      {entry.startTime} - {entry.endTime}
                    </td>
                    <td className="p-4 font-semibold">{entry.hours}h</td>
                    <td className="p-4 text-sm text-gray-400">{entry.notes || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        entry.approved 
                          ? 'bg-green-900 text-green-200' 
                          : 'bg-yellow-900 text-yellow-200'
                      }`}>
                        {entry.approved ? 'APPROVED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleApproval(entry.id)}
                        className={`px-3 py-1 rounded text-sm ${
                          entry.approved
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {entry.approved ? 'Unapprove' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  activeJobs: number;
  completedJobs: number;
  hoursThisWeek: number;
  status: 'AVAILABLE' | 'ON_JOB' | 'OFF_DUTY';
}

export default function TeamOverview() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTeam([
        {
          id: '1',
          name: 'Mike Johnson',
          role: 'Lead Technician',
          email: 'mike@company.com',
          phone: '555-0101',
          activeJobs: 3,
          completedJobs: 127,
          hoursThisWeek: 38,
          status: 'ON_JOB',
        },
        {
          id: '2',
          name: 'Sarah Smith',
          role: 'HVAC Specialist',
          email: 'sarah@company.com',
          phone: '555-0102',
          activeJobs: 2,
          completedJobs: 94,
          hoursThisWeek: 35,
          status: 'AVAILABLE',
        },
        {
          id: '3',
          name: 'Tom Brown',
          role: 'Plumber',
          email: 'tom@company.com',
          phone: '555-0103',
          activeJobs: 1,
          completedJobs: 156,
          hoursThisWeek: 40,
          status: 'ON_JOB',
        },
        {
          id: '4',
          name: 'Emily Davis',
          role: 'Electrician',
          email: 'emily@company.com',
          phone: '555-0104',
          activeJobs: 0,
          completedJobs: 83,
          hoursThisWeek: 32,
          status: 'OFF_DUTY',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const totalActiveJobs = team.reduce((sum, m) => sum + m.activeJobs, 0);
  const totalCompletedJobs = team.reduce((sum, m) => sum + m.completedJobs, 0);
  const averageHours = team.reduce((sum, m) => sum + m.hoursThisWeek, 0) / team.length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Team Overview</h1>
        <p className="text-gray-400 mt-1">Manage your field service team</p>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading team...</div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-2">Total Team Members</h3>
                <div className="text-3xl font-bold">{team.length}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-2">Active Jobs</h3>
                <div className="text-3xl font-bold text-blue-400">{totalActiveJobs}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-2">Completed Jobs (Total)</h3>
                <div className="text-3xl font-bold text-green-400">{totalCompletedJobs}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-2">Avg Hours This Week</h3>
                <div className="text-3xl font-bold text-purple-400">{averageHours.toFixed(1)}</div>
              </div>
            </div>

            <div className="grid gap-4">
              {team.map(member => (
                <div key={member.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          member.status === 'AVAILABLE' ? 'bg-green-900 text-green-200' :
                          member.status === 'ON_JOB' ? 'bg-blue-900 text-blue-200' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {member.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-3">{member.role}</p>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>{member.email}</span>
                        <span>•</span>
                        <span>{member.phone}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 ml-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{member.activeJobs}</div>
                        <div className="text-xs text-gray-400 mt-1">Active Jobs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{member.completedJobs}</div>
                        <div className="text-xs text-gray-400 mt-1">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{member.hoursThisWeek}</div>
                        <div className="text-xs text-gray-400 mt-1">Hours This Week</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';

interface Visit {
  id: string;
  title: string;
  jobTitle: string;
  clientName: string;
  startAt: string;
  endAt: string;
  assignedTo: string[];
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export default function ScheduleCalendar() {
  const [currentDate] = useState(new Date('2024-02-15'));
  const [visits] = useState<Visit[]>([
    {
      id: '1',
      title: 'HVAC Installation',
      jobTitle: 'Residential HVAC',
      clientName: 'John Doe',
      startAt: '2024-02-15T09:00:00Z',
      endAt: '2024-02-15T12:00:00Z',
      assignedTo: ['Mike Johnson', 'Sarah Smith'],
      status: 'SCHEDULED',
    },
    {
      id: '2',
      title: 'Plumbing Inspection',
      jobTitle: 'Annual Inspection',
      clientName: 'Jane Wilson',
      startAt: '2024-02-15T13:00:00Z',
      endAt: '2024-02-15T15:00:00Z',
      assignedTo: ['Tom Brown'],
      status: 'IN_PROGRESS',
    },
    {
      id: '3',
      title: 'Electrical Repair',
      jobTitle: 'Emergency Service',
      clientName: 'Bob Miller',
      startAt: '2024-02-15T16:00:00Z',
      endAt: '2024-02-15T18:00:00Z',
      assignedTo: ['Mike Johnson'],
      status: 'SCHEDULED',
    },
  ]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getVisitStyle = (visit: Visit) => {
    const start = new Date(visit.startAt);
    const end = new Date(visit.endAt);
    const startHour = start.getHours();
    const endHour = end.getHours();
    const top = (startHour - 8) * 80;
    const height = (endHour - startHour) * 80;
    
    return { top: `${top}px`, height: `${height}px` };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Schedule Calendar</h1>
        <p className="text-gray-400 mt-1">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="relative" style={{ height: '960px' }}>
                {hours.map(hour => (
                  <div
                    key={hour}
                    className="absolute w-full border-b border-gray-700 flex items-start px-4"
                    style={{ top: `${(hour - 8) * 80}px`, height: '80px' }}
                  >
                    <span className="text-sm text-gray-500 w-16">
                      {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </span>
                  </div>
                ))}
                
                <div className="absolute left-20 right-4 top-0 bottom-0">
                  {visits.map((visit, index) => (
                    <div
                      key={visit.id}
                      className={`absolute left-0 right-0 rounded-lg p-3 border-l-4 ${
                        visit.status === 'SCHEDULED' ? 'bg-blue-900 border-blue-500' :
                        visit.status === 'IN_PROGRESS' ? 'bg-yellow-900 border-yellow-500' :
                        visit.status === 'COMPLETED' ? 'bg-green-900 border-green-500' :
                        'bg-gray-700 border-gray-500'
                      }`}
                      style={{ ...getVisitStyle(visit), marginLeft: `${index * 10}px`, width: 'calc(100% - 20px)' }}
                    >
                      <h4 className="font-semibold text-sm mb-1">{visit.title}</h4>
                      <p className="text-xs text-gray-300 mb-1">{visit.clientName}</p>
                      <p className="text-xs text-gray-400">
                        {visit.assignedTo.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {visits.map(visit => (
                <div key={visit.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className={`text-xs font-semibold mb-2 ${
                    visit.status === 'SCHEDULED' ? 'text-blue-400' :
                    visit.status === 'IN_PROGRESS' ? 'text-yellow-400' :
                    visit.status === 'COMPLETED' ? 'text-green-400' :
                    'text-gray-400'
                  }`}>
                    {visit.status.replace('_', ' ')}
                  </div>
                  <h3 className="font-semibold mb-1">{visit.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{visit.clientName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(visit.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - 
                    {new Date(visit.endAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <div className="mt-2 text-xs text-gray-400">
                    {visit.assignedTo.map((person, i) => (
                      <span key={i} className="inline-block bg-gray-700 rounded px-2 py-1 mr-1 mb-1">
                        {person}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { FaellinoEvent, Attendance, AttendanceStatus, User } from '../types';
import { Calendar as CalendarIcon, CheckCircle, XCircle, HelpCircle, Utensils, Gamepad2, Flame } from 'lucide-react';

// Mock data initialization
const generateDays = () => {
  const dates: FaellinoEvent[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const dateStr = nextDate.toISOString().split('T')[0];
    
    // Assign random types for demo
    let type: FaellinoEvent['type'] = 'CHILL';
    if (nextDate.getDay() === 5) type = 'MAGIC'; // Friday
    if (nextDate.getDay() === 6) type = 'DINNER'; // Saturday
    
    dates.push({
      id: dateStr,
      date: dateStr,
      title: nextDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }),
      type,
      attendees: []
    });
  }
  return dates;
};

const CURRENT_USER: User = { id: 'u1', name: 'Tu', avatar: '' };

const CalendarBooker: React.FC = () => {
  const [events, setEvents] = useState<FaellinoEvent[]>(generateDays());

  const toggleAttendance = (eventId: string, status: AttendanceStatus) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;

      const existingAtt = ev.attendees.find(a => a.userId === CURRENT_USER.id);
      let newAttendees = [...ev.attendees];

      if (existingAtt) {
        if (existingAtt.status === status) {
           // Toggle off if clicking same status
           newAttendees = newAttendees.filter(a => a.userId !== CURRENT_USER.id);
        } else {
           // Change status
           newAttendees = newAttendees.map(a => a.userId === CURRENT_USER.id ? { ...a, status } : a);
        }
      } else {
        // Add new
        newAttendees.push({ userId: CURRENT_USER.id, status });
      }

      return { ...ev, attendees: newAttendees };
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DINNER': return <Utensils className="text-orange-400" />;
      case 'MAGIC': return <Flame className="text-purple-500" />;
      case 'PS5': return <Gamepad2 className="text-blue-400" />;
      default: return <CalendarIcon className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-faella-green text-faella-900 border-faella-green';
      case AttendanceStatus.MAYBE: return 'bg-yellow-600 text-white border-yellow-600';
      case AttendanceStatus.ABSENT: return 'bg-red-600 text-white border-red-600';
      default: return 'bg-transparent border-gray-600 text-gray-400';
    }
  };

  return (
    <div className="w-full bg-faella-800 rounded-xl p-4 shadow-xl border border-faella-700">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <CalendarIcon className="text-faella-green" />
        Prossime Serate
      </h2>

      <div className="space-y-4">
        {events.map((evt) => {
          const myStatus = evt.attendees.find(a => a.userId === CURRENT_USER.id)?.status;
          
          return (
            <div key={evt.id} className="bg-faella-900 rounded-lg p-4 border border-faella-700 hover:border-faella-500 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-faella-800 p-3 rounded-lg">
                    {getTypeIcon(evt.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white capitalize">{evt.title}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-faella-700 text-gray-300">
                      {evt.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                   <span className="text-sm text-gray-400 mb-1">
                     {evt.attendees.filter(a => a.status === AttendanceStatus.PRESENT).length} Presenti
                   </span>
                   {/* Mini avatars would go here */}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => toggleAttendance(evt.id, AttendanceStatus.PRESENT)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md border font-semibold transition-all ${
                    myStatus === AttendanceStatus.PRESENT ? getStatusColor(AttendanceStatus.PRESENT) : 'border-gray-600 hover:border-faella-green text-gray-400'
                  }`}
                >
                  <CheckCircle size={18} /> Ci sono
                </button>
                <button 
                  onClick={() => toggleAttendance(evt.id, AttendanceStatus.MAYBE)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md border font-semibold transition-all ${
                    myStatus === AttendanceStatus.MAYBE ? getStatusColor(AttendanceStatus.MAYBE) : 'border-gray-600 hover:border-yellow-500 text-gray-400'
                  }`}
                >
                  <HelpCircle size={18} /> Forse
                </button>
                <button 
                  onClick={() => toggleAttendance(evt.id, AttendanceStatus.ABSENT)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md border font-semibold transition-all ${
                    myStatus === AttendanceStatus.ABSENT ? getStatusColor(AttendanceStatus.ABSENT) : 'border-gray-600 hover:border-red-500 text-gray-400'
                  }`}
                >
                  <XCircle size={18} /> Passo
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarBooker;
import React, { useState, useEffect } from 'react';
import { FaellinoEvent, Attendance, AttendanceStatus, User } from '../types';
import { Calendar as CalendarIcon, CheckCircle, XCircle, HelpCircle, Utensils, Gamepad2, Flame, User as UserIcon } from 'lucide-react';

// Mock friends to make the static app feel alive
const FRIENDS = ['Il Sebra', 'Vaggia', 'Tano', 'Pippo', 'Lollo'];

const getRandomAttendees = (): Attendance[] => {
  const attendees: Attendance[] = [];
  // Randomly add 0 to 3 friends
  const count = Math.floor(Math.random() * 4);
  const shuffled = [...FRIENDS].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < count; i++) {
    attendees.push({
      userId: `friend-${i}`,
      status: AttendanceStatus.PRESENT,
      note: 'Presente!'
    });
  }
  return attendees;
};

const generateDays = (): FaellinoEvent[] => {
  const dates: FaellinoEvent[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const dateStr = nextDate.toISOString().split('T')[0];
    
    let type: FaellinoEvent['type'] = 'CHILL';
    const day = nextDate.getDay();
    if (day === 5) type = 'MAGIC'; // Friday
    if (day === 6) type = 'DINNER'; // Saturday
    if (day === 0) type = 'PS5'; // Sunday
    
    dates.push({
      id: dateStr,
      date: dateStr,
      title: nextDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }),
      type,
      attendees: getRandomAttendees() // Pre-populate with bots
    });
  }
  return dates;
};

const CURRENT_USER: User = { id: 'me', name: 'Tu', avatar: '' };
const STORAGE_KEY = 'faellino_calendar_v1';

const CalendarBooker: React.FC = () => {
  const [events, setEvents] = useState<FaellinoEvent[]>(() => {
    // Initialize with generated days
    const freshEvents = generateDays();
    
    // Load user choices from local storage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedStatus: Record<string, AttendanceStatus> = JSON.parse(saved);
        
        // Merge saved status into fresh events
        return freshEvents.map(ev => {
          if (parsedStatus[ev.id]) {
            // Add user to attendees if they had a status saved
            const userAtt: Attendance = { userId: CURRENT_USER.id, status: parsedStatus[ev.id] };
            return { ...ev, attendees: [...ev.attendees, userAtt] };
          }
          return ev;
        });
      }
    } catch (e) {
      console.error("Failed to load calendar", e);
    }
    return freshEvents;
  });

  // Save to local storage whenever events change
  useEffect(() => {
    const statusMap: Record<string, AttendanceStatus> = {};
    events.forEach(ev => {
      const myAtt = ev.attendees.find(a => a.userId === CURRENT_USER.id);
      if (myAtt) {
        statusMap[ev.id] = myAtt.status;
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statusMap));
  }, [events]);

  const toggleAttendance = (eventId: string, status: AttendanceStatus) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;

      const existingAtt = ev.attendees.find(a => a.userId === CURRENT_USER.id);
      let newAttendees = [...ev.attendees];

      if (existingAtt) {
        if (existingAtt.status === status) {
           // Toggle off
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
          const otherCount = evt.attendees.filter(a => a.userId !== CURRENT_USER.id && a.status === AttendanceStatus.PRESENT).length;
          
          return (
            <div key={evt.id} className="bg-faella-900 rounded-lg p-4 border border-faella-700 hover:border-faella-500 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-faella-800 p-3 rounded-lg">
                    {getTypeIcon(evt.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white capitalize">{evt.title}</h3>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-faella-700 text-gray-300">
                        {evt.type}
                      </span>
                      {otherCount > 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                           <UserIcon size={10} /> +{otherCount} amici
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  {myStatus === AttendanceStatus.PRESENT && (
                    <span className="text-faella-green font-bold text-sm bg-faella-green/10 px-2 py-1 rounded">Presente</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => toggleAttendance(evt.id, AttendanceStatus.PRESENT)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md border font-semibold transition-all ${
                    myStatus === AttendanceStatus.PRESENT ? getStatusColor(AttendanceStatus.PRESENT) : 'border-gray-600 hover:border-faella-green text-gray-400 hover:text-white'
                  }`}
                >
                  <CheckCircle size={18} /> <span className="hidden sm:inline">Ci sono</span>
                </button>
                <button 
                  onClick={() => toggleAttendance(evt.id, AttendanceStatus.MAYBE)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md border font-semibold transition-all ${
                    myStatus === AttendanceStatus.MAYBE ? getStatusColor(AttendanceStatus.MAYBE) : 'border-gray-600 hover:border-yellow-500 text-gray-400 hover:text-white'
                  }`}
                >
                  <HelpCircle size={18} /> <span className="hidden sm:inline">Forse</span>
                </button>
                <button 
                  onClick={() => toggleAttendance(evt.id, AttendanceStatus.ABSENT)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md border font-semibold transition-all ${
                    myStatus === AttendanceStatus.ABSENT ? getStatusColor(AttendanceStatus.ABSENT) : 'border-gray-600 hover:border-red-500 text-gray-400 hover:text-white'
                  }`}
                >
                  <XCircle size={18} /> <span className="hidden sm:inline">Passo</span>
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
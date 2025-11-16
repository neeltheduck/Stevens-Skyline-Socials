import React, { useState } from 'react';
import { Calendar } from './components/Calendar';
import { EventDetails } from './components/EventDetails';
import { CreateEvent } from './components/CreateEvent';
import { MyRegisteredEvents } from './components/MyRegisteredEvents';
import { Navigation } from './components/Navigation';

export type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  category: string;
  attendees: number;
  manager: string;
  description: string;
};

function App() {
  const [currentPage, setCurrentPage] = useState<'calendar' | 'event-details' | 'create-event' | 'my-events'>('calendar');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(['1', '3']);
  
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Tech Talk: AI & ML',
      date: '2025-11-05',
      time: '18:00',
      category: 'Academic',
      attendees: 45,
      manager: 'Computer Science Society',
      description: 'Join us for an exciting evening exploring the latest developments in artificial intelligence and machine learning. Industry professionals will share insights on current trends and future opportunities in the field.'
    },
    {
      id: '2',
      name: 'Basketball Tournament',
      date: '2025-11-08',
      time: '15:00',
      category: 'Sports',
      attendees: 32,
      manager: 'Athletics Club',
      description: 'Annual inter-department basketball tournament. Form your teams and compete for the championship trophy. All skill levels welcome!'
    },
    {
      id: '3',
      name: 'Fall Career Fair',
      date: '2025-11-12',
      time: '10:00',
      category: 'Career',
      attendees: 156,
      manager: 'Career Services',
      description: 'Meet with top employers from various industries. Bring your resume and dress professionally. Great opportunity to network and explore internship and full-time positions.'
    },
    {
      id: '4',
      name: 'Open Mic Night',
      date: '2025-11-15',
      time: '19:00',
      category: 'Social',
      attendees: 28,
      manager: 'Student Activities Board',
      description: 'Showcase your talent or enjoy performances from fellow students. Music, poetry, comedy - all forms of expression welcome. Free snacks and refreshments provided.'
    },
    {
      id: '5',
      name: 'Study Group: Finals Prep',
      date: '2025-11-20',
      time: '14:00',
      category: 'Academic',
      attendees: 18,
      manager: 'Study Hub',
      description: 'Collaborative study session to prepare for upcoming finals. Quiet study spaces and group discussion areas available. Tutors will be on hand to help with difficult concepts.'
    },
    {
      id: '6',
      name: 'Thanksgiving Potluck',
      date: '2025-11-22',
      time: '17:00',
      category: 'Social',
      attendees: 67,
      manager: 'International Student Association',
      description: 'Celebrate Thanksgiving with the Stevens community! Bring a dish to share and enjoy food from around the world. A great way to connect with friends before the holiday break.'
    },
    {
      id: '7',
      name: 'Hackathon 2025',
      date: '2025-11-16',
      time: '09:00',
      category: 'Technology',
      attendees: 89,
      manager: 'CS Club',
      description: '24-hour hackathon with exciting challenges and prizes. Form teams, build innovative solutions, and compete for awards. Meals and snacks provided throughout the event.'
    }
  ]);

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentPage('event-details');
  };

  const handleRSVP = (eventId: string) => {
    if (!registeredEventIds.includes(eventId)) {
      setRegisteredEventIds([...registeredEventIds, eventId]);
    }
    setCurrentPage('my-events');
  };

  const handleCreateEvent = (newEvent: Omit<Event, 'id' | 'attendees'>) => {
    const event: Event = {
      ...newEvent,
      id: String(events.length + 1),
      attendees: 0
    };
    setEvents([...events, event]);
    setCurrentPage('calendar');
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const registeredEvents = events.filter(e => registeredEventIds.includes(e.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="max-w-[1440px] mx-auto">
        {currentPage === 'calendar' && (
          <Calendar events={events} onEventClick={handleEventClick} />
        )}
        
        {currentPage === 'event-details' && selectedEvent && (
          <EventDetails 
            event={selectedEvent} 
            onRSVP={handleRSVP}
            isRegistered={registeredEventIds.includes(selectedEvent.id)}
          />
        )}
        
        {currentPage === 'create-event' && (
          <CreateEvent onCreateEvent={handleCreateEvent} />
        )}
        
        {currentPage === 'my-events' && (
          <MyRegisteredEvents events={registeredEvents} onEventClick={handleEventClick} />
        )}
      </main>
    </div>
  );
}

export default App;

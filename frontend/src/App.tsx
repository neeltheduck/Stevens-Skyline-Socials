import { useEffect, useState } from 'react';
import { Calendar } from './components/Calendar';
import { EventDetails } from './components/EventDetails';
import { CreateEvent } from './components/CreateEvent';
import { MyRegisteredEvents } from './components/MyRegisteredEvents';
import { MyCreatedEvents } from './components/MyCreatedEvents';
import { EditEvent } from './components/EditEvent';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Navigation } from './components/Navigation';

export type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  category: string;
  attendees: number;
  manager: string;
  createdBy?: string;
  description: string;
};

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState<'calendar' | 'event-details' | 'create-event' | 'my-events' | 'my-created' | 'edit-event' | 'login' | 'register'>(token ? 'calendar' : 'login');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; firstName: string; lastName: string } | null>(null);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);

  const [events, setEvents] = useState<Event[]>([
  ]);

  useEffect(() => {
    // fetch events from API on mount
    fetch('/api/events')
      .then(res => res.json())
      .then((data: Event[]) => setEvents(data))
      .catch(err => console.error('Failed to fetch events', err));

    if (token) {
      fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)     // line changed: check res.ok
        .then(user => {
          if (!user) {                              // line added: handle invalid token
            localStorage.removeItem('token');
            setToken(null);
            setCurrentUser(null);
            setRegisteredEventIds([]);
            return;
          }
          setCurrentUser(user);

          fetch('/api/registrations', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : [])  // line changed: default empty array if API fails
            .then((regs: any) => setRegisteredEventIds(Array.isArray(regs) ? regs : [])) // line changed: ensure array
            .catch(() => setRegisteredEventIds([]));
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
          setRegisteredEventIds([]);
        });
    }
  }, []);

  // enforce authentication for site pages: redirect to login when not authenticated
  useEffect(() => {
    // If there's no authenticated user and no token, force login.
    // If a token exists we wait for `/api/me` to validate it instead of immediately redirecting.
    if (!currentUser && !token && currentPage !== 'login' && currentPage !== 'register') {
      setCurrentPage('login');
    }
  }, [currentUser, currentPage]);

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentPage('event-details');
  };

  const handleRSVP = (eventId: string) => {
    if (!token || !currentUser) return;
    if (!registeredEventIds.includes(eventId)) {
      // call API to register
      fetch(`/api/events/${eventId}/register`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then((data: { eventId: string; attendees: number }) => {
          setRegisteredEventIds(prev => [...prev, eventId]);
          setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendees: data.attendees } : e));
        })
        .catch(err => console.error('Failed to persist RSVP', err));
    }
    setCurrentPage('my-events');
  };

  const handleUnregister = (eventId: string) => {
    if (!token || !currentUser) return;
    if (registeredEventIds.includes(eventId)) {
      fetch(`/api/events/${eventId}/register`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then((data: { eventId: string; attendees: number }) => {
          setRegisteredEventIds(prev => prev.filter(id => id !== eventId));
          setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendees: data.attendees } : e));
        })
        .catch(err => console.error('Failed to persist unregister', err));
    }
  };

  const handleCreateEvent = (newEvent: Omit<Event, 'id' | 'attendees'>) => {
    const payload = { ...newEvent, attendees: 0, createdBy: currentUser?.id };
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then((created: Event) => {
        setEvents(prev => [...prev, created]);
        if (currentUser) {
          setRegisteredEventIds(prev => [...prev, created.id]); // add this line
        }
        setCurrentPage('calendar');
      })
      .catch(err => console.error('Failed to create event', err));
  };

  const handleUpdateEvent = (updated: Event) => {
    // persist to API
    fetch(`/api/events/${updated.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(updated) })
      .then(res => res.json())
      .then((saved: Event) => {
        setEvents(prev => prev.map(e => e.id === saved.id ? saved : e));
        setSelectedEventId(saved.id);
        setCurrentPage('event-details');
      })
      .catch(err => console.error('Failed to update event', err));
  };

  const handleDeleteEvent = (eventId: string) => {
    // delete on API then update local state
    fetch(`/api/events/${eventId}`, { method: 'DELETE', headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
      .then(() => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setRegisteredEventIds(prev => prev.filter(id => id !== eventId));
        if (selectedEventId === eventId) {
          setSelectedEventId(null);
          setCurrentPage('calendar');
        }
      })
      .catch(err => console.error('Failed to delete event', err));
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const registeredEvents = events.filter(e => Array.isArray(registeredEventIds) && registeredEventIds.includes(e.id));
  const createdEvents = currentUser ? events.filter(e => e.createdBy === currentUser.id) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={(p: any) => {
        // if trying to access protected pages, ensure authenticated
        if ((p === 'create-event' || p === 'my-created' || p === 'my-events' || p === 'edit-event' || p === 'event-details') && !currentUser) {
          setCurrentPage('login');
        } else {
          setCurrentPage(p as any);
        }
      }} onLogout={() => { localStorage.removeItem('token'); setToken(null); setCurrentUser(null); setRegisteredEventIds([]); setCurrentPage('login'); }} isAuthenticated={!!currentUser} />

      <main className="max-w-[1440px] mx-auto">
        {currentPage === 'calendar' && (
          <Calendar events={events} onEventClick={handleEventClick} />
        )}

        {currentPage === 'event-details' && selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onRSVP={handleRSVP}
            onUnregister={handleUnregister}
            isRegistered={Array.isArray(registeredEventIds) && registeredEventIds.includes(selectedEvent.id)}
          />
        )}

        {currentPage === 'create-event' && (
          <CreateEvent onCreateEvent={(payload) => {
            if (!token) return;
            handleCreateEvent(payload);
          }} />
        )}

        {currentPage === 'my-created' && (
          <MyCreatedEvents
            events={createdEvents}
            onEventClick={handleEventClick}
            onEdit={(id) => { setSelectedEventId(id); setCurrentPage('edit-event'); }}
            onDelete={(id) => { if (!token) return; handleDeleteEvent(id); }}
          />
        )}

        {currentPage === 'edit-event' && selectedEvent && (
          <EditEvent
            event={selectedEvent}
            onSave={(updated) => { if (!token) return; handleUpdateEvent(updated); }}
            onCancel={() => setCurrentPage('my-created')}
          />
        )}

        {currentPage === 'my-events' && (
          <MyRegisteredEvents events={registeredEvents} onEventClick={handleEventClick} onUnregister={(id) => { if (!token) return; handleUnregister(id); }} />
        )}

        {currentPage === 'login' && (
          <Login
            onLogin={(tkn: string, user: any) => {
              localStorage.setItem('token', tkn);
              setToken(tkn);
              setCurrentUser(user);
              // fetch fresh events and registrations
              fetch('/api/events')
                .then(res => res.json())
                .then((data: Event[]) => setEvents(data))
                .catch(() => { });
              fetch('/api/registrations', { headers: { Authorization: `Bearer ${tkn}` } })
                .then(res => res.json())
                .then((regs: string[]) => setRegisteredEventIds(regs))
                .catch(() => setRegisteredEventIds([]));
              setCurrentPage('calendar');
            }}
            onSwitchToRegister={() => setCurrentPage('register')}
          />
        )}

        {currentPage === 'register' && (
          <Register
            onRegisterSuccess={(tkn: string, user: any) => {
              localStorage.setItem('token', tkn);
              setToken(tkn);
              setCurrentUser(user);
              // fetch fresh events and registrations
              fetch('/api/events')
                .then(res => res.json())
                .then((data: Event[]) => setEvents(data))
                .catch(() => { });
              fetch('/api/registrations', { headers: { Authorization: `Bearer ${tkn}` } })
                .then(res => res.json())
                .then((regs: string[]) => setRegisteredEventIds(regs))
                .catch(() => setRegisteredEventIds([]));
              setCurrentPage('calendar');
            }}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        )}
      </main>
    </div>
  );
}

export default App;

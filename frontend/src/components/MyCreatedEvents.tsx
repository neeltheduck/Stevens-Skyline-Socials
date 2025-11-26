import { Calendar, Clock } from 'lucide-react';
import type { Event } from '../App';

type MyCreatedEventsProps = {
  events: Event[];
  onEventClick: (eventId: string) => void;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
};

export function MyCreatedEvents({ events, onEventClick, onEdit, onDelete }: MyCreatedEventsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-gray-900 mb-8">My Created Events</h2>
        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">You haven't created any events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {events.map(event => (
              <div
                key={event.id}
                onClick={() => onEventClick(event.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <h3 className="text-gray-900 mb-4">{event.name}</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(event.time)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded">
                    {event.category}
                  </span>

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(event.id); }}
                      className="inline-block px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
                      className="inline-block px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
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

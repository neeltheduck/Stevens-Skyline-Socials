import React from 'react';
import { Calendar, Clock, Tag, Users, UserCircle } from 'lucide-react';
import type { Event } from '../App';

type EventDetailsProps = {
  event: Event;
  onRSVP: (eventId: string) => void;
  isRegistered: boolean;
};

export function EventDetails({ event, onRSVP, isRegistered }: EventDetailsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
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
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <h2 className="text-gray-900 mb-8">{event.name}</h2>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <div className="text-gray-500 mb-1">Date</div>
              <div className="text-gray-900">{formatDate(event.date)}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <div className="text-gray-500 mb-1">Time</div>
              <div className="text-gray-900">{formatTime(event.time)}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <div className="text-gray-500 mb-1">Category</div>
              <div className="text-gray-900">{event.category}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <div className="text-gray-500 mb-1">Attendees</div>
              <div className="text-gray-900">{event.attendees} registered</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserCircle className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <div className="text-gray-500 mb-1">Event Manager</div>
              <div className="text-gray-900">{event.manager}</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-gray-500 mb-3">Description</div>
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>

        <button
          onClick={() => onRSVP(event.id)}
          disabled={isRegistered}
          className={`w-full py-4 rounded transition-colors ${
            isRegistered
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isRegistered ? 'Already Registered' : 'RSVP to Event'}
        </button>
      </div>
    </div>
  );
}

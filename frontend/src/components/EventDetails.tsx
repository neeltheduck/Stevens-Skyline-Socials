import React from "react";
import { Calendar, Clock, Tag, Users, UserCircle } from "lucide-react";
import type { Event } from "../App";

type EventDetailsProps = {
  event: Event;
  onRSVP: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
  isRegistered: boolean;
};

export function EventDetails({
  event,
  onRSVP,
  onUnregister,
  isRegistered,
}: EventDetailsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {event.name}
        </h2>

        <div className="grid gap-8 md:grid-cols-12">
          {/* Left column: event info */}
          <div className="md:col-span-8">
            <div className="divide-y divide-gray-100 rounded-lg">
              <div className="flex items-start gap-3 py-4">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Date</div>
                  <div className="text-gray-900 font-medium">
                    {formatDate(event.date)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <Clock className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Time</div>
                  <div className="text-gray-900 font-medium">
                    {formatTime(event.time)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <Tag className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Category</div>
                  <div className="text-gray-900 font-medium">
                    {event.category}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <Users className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Attendees</div>
                  <div className="text-gray-900 font-medium">
                    {event.attendees} registered
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <UserCircle className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Event Manager
                  </div>
                  <div className="text-gray-900 font-medium">
                    {event.manager}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-sm text-gray-500 mb-2">Description</div>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {/* Right column: RSVP card */}
          <div className="md:col-span-4">
            <div className="sticky top-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
              {isRegistered ? (
                <button
                  onClick={() => onUnregister && onUnregister(event.id)}
                  className="w-full py-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Unregister from Event
                </button>
              ) : (
                <button
                  onClick={() => onRSVP(event.id)}
                  className="w-full py-4 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  RSVP to Event
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

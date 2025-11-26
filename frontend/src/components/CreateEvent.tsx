import React, { useState } from "react";
import type { Event } from "../App";


type CreateEventProps = {
  onCreateEvent: (event: Omit<Event, "id" | "attendees">) => void;
};

export function CreateEvent({ onCreateEvent }: CreateEventProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    category: "Academic",
    manager: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateEvent(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const minDate = `${currentYear}-${month}-${day}`; // today
  const maxDate = `${currentYear + 4}-12-31`; // four years from now

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Create a New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div className="md:grid md:grid-cols-12 md:items-center md:gap-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-0 md:col-span-4 md:text-right"
            >
              Event Name
            </label>
            <div className="md:col-span-8">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter event name"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="md:grid md:grid-cols-12 md:items-start md:gap-4">
            <span className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-0 md:col-span-4 md:text-right">
              Date & Time
            </span>
            <div className="md:col-span-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={minDate}
                    max={maxDate}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="md:grid md:grid-cols-12 md:items-center md:gap-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-0 md:col-span-4 md:text-right"
            >
              Category
            </label>
            <div className="md:col-span-8">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="Academic">Academic</option>
                <option value="Social">Social</option>
                <option value="Sports">Sports</option>
                <option value="Career">Career</option>
                <option value="Technology">Technology</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
          </div>

          {/* Manager */}
          <div className="md:grid md:grid-cols-12 md:items-center md:gap-4">
            <label
              htmlFor="manager"
              className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-0 md:col-span-4 md:text-right"
            >
              Event Manager / Organization
            </label>
            <div className="md:col-span-8">
              <input
                type="text"
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Your name or organization"
              />
            </div>
          </div>

          {/* Description */}
          <div className="md:grid md:grid-cols-12 md:gap-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-0 md:col-span-4 md:text-right"
            >
              Description
            </label>
            <div className="md:col-span-8">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                placeholder="Describe your event..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full md:max-w-sm mx-auto block bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

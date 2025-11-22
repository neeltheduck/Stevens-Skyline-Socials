import React, { useState } from 'react';
import type { Event } from '../App';

type EditEventProps = {
  event: Event;
  onSave: (event: Event) => void;
  onCancel: () => void;
};

export function EditEvent({ event, onSave, onCancel }: EditEventProps) {
  const [formData, setFormData] = useState({
    name: event.name,
    date: event.date,
    time: event.time,
    category: event.category,
    manager: event.manager,
    description: event.description
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Event = {
      ...event,
      name: formData.name,
      date: formData.date,
      time: formData.time,
      category: formData.category,
      manager: formData.manager,
      description: formData.description
    };
    onSave(updated);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <h2 className="text-gray-900 mb-8">Edit Event</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-gray-700 mb-2">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded" />
          </div>

          <div>
            <label htmlFor="time" className="block text-gray-700 mb-2">Time</label>
            <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded" />
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded">
              <option value="Academic">Academic</option>
              <option value="Social">Social</option>
              <option value="Sports">Sports</option>
              <option value="Career">Career</option>
              <option value="Technology">Technology</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          <div>
            <label htmlFor="manager" className="block text-gray-700 mb-2">Event Manager / Organization</label>
            <input type="text" id="manager" name="manager" value={formData.manager} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded" />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={6} className="w-full px-4 py-3 border border-gray-300 rounded resize-none" />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-gray-900 text-white py-3 rounded">Save Changes</button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

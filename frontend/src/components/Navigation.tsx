import React from 'react';

type NavigationProps = {
  currentPage: string;
  onNavigate: (page: 'calendar' | 'event-details' | 'create-event' | 'my-events' | 'my-created' | 'login' | 'register') => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
};

export function Navigation({ currentPage, onNavigate, onLogout, isAuthenticated }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer"
            onClick={() => onNavigate('calendar')}
          >
            <h1 className="text-gray-900">Stevens Skyline Socials</h1>
          </div>
          
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('calendar')}
              className={`px-4 py-2 rounded transition-colors ${
                currentPage === 'calendar' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
            
            <button
              onClick={() => onNavigate('create-event')}
              className={`px-4 py-2 rounded transition-colors ${
                currentPage === 'create-event' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Create Event
            </button>
            
            <button
              onClick={() => onNavigate('my-events')}
              className={`px-4 py-2 rounded transition-colors ${
                currentPage === 'my-events' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Registered Events
            </button>

            <button
              onClick={() => onNavigate('my-created')}
              className={`px-4 py-2 rounded transition-colors ${
                currentPage === 'my-created' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Created Events
            </button>
            {!isAuthenticated ? (
              <>
                <button onClick={() => onNavigate('register')} className="px-4 py-2 rounded text-gray-600 hover:text-gray-900">Register</button>
                <button onClick={() => onNavigate('login')} className="px-4 py-2 rounded text-gray-600 hover:text-gray-900">Login</button>
              </>
            ) : (
              <button onClick={onLogout} className="px-4 py-2 rounded text-gray-600 hover:text-gray-900">Log out</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

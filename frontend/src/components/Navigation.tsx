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
      <div className="max-w-[1200px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div
            className="cursor-pointer"
            onClick={() => onNavigate('calendar')}
          >
            <h1 className="text-gray-900 text-lg font-semibold">Stevens Skyline Socials</h1>
            <p className="text-sm text-gray-500 -mt-0.5">Campus events & meetups</p>
          </div>

          <ul className="hidden md:flex items-center gap-4">
            <li>
              <button
                onClick={() => onNavigate('calendar')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  currentPage === 'calendar'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Calendar
              </button>
            </li>

            <li>
              <button
                onClick={() => onNavigate('create-event')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  currentPage === 'create-event'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Create Event
              </button>
            </li>

            <li>
              <button
                onClick={() => onNavigate('my-events')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  currentPage === 'my-events'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Registered
              </button>
            </li>

            <li>
              <button
                onClick={() => onNavigate('my-created')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  currentPage === 'my-created'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Created
              </button>
            </li>

            {!isAuthenticated ? (
              <>
                <li>
                  <button
                    onClick={() => onNavigate('register')}
                    className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-indigo-600 transition"
                  >
                    Register
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('login')}
                    className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-indigo-600 transition"
                  >
                    Login
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-indigo-600 transition"
                >
                  Log out
                </button>
              </li>
            )}
          </ul>

          <div className="md:hidden">
            <button
              onClick={() => onNavigate('calendar')}
              className="px-2 py-1 rounded-md text-sm text-gray-600 hover:text-indigo-600 transition"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
}

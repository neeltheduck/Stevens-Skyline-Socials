import React, { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";

const HOVER_COLOR = "orange";

type NavigationProps = {
  currentPage: string;
  onNavigate: (
    page:
      | "calendar"
      | "event-details"
      | "create-event"
      | "my-events"
      | "my-created"
      | "login"
      | "register"
  ) => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
};

export function Navigation({
  currentPage,
  onNavigate,
  onLogout,
  isAuthenticated,
}: NavigationProps) {
  // Sync app-level page state with browser history so back/forward work
  const initializedRef = useRef(false);
  const suppressPushRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      window.history.replaceState({ page: currentPage }, "", window.location.href);
      initializedRef.current = true;
      return;
    }

    if (suppressPushRef.current) {
      suppressPushRef.current = false;
      return;
    }

    const state = window.history.state as { page?: string } | null;
    if (!state || state.page !== currentPage) {
      window.history.pushState({ page: currentPage }, "", window.location.href);
    }
  }, [currentPage]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const page = (e.state as { page?: NavigationProps["currentPage"] } | null)?.page;
      if (page && page !== currentPage) {
        suppressPushRef.current = true; // prevent pushing immediately after navigating due to popstate
        onNavigate(page as any);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [currentPage, onNavigate]);
  return (
    <nav className="bg-[#9D1535] border-b border-[#FFFFFE]">
      <div className="max-w-[1200px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              onClick={(e) => {
                e.stopPropagation();
                window.history.back();
              }}
              className="p-2 rounded-md text-white transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                "--tw-ring-color": HOVER_COLOR,
              } as React.CSSProperties}
              onMouseEnter={(e) => (e.currentTarget.style.color = HOVER_COLOR)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div
              className="cursor-pointer"
              onClick={() => onNavigate("calendar")}
            >
              <h1 className="text-white text-lg font-semibold">
                Stevens Skyline Socials
              </h1>

              <p className="text-sm text-gray-400 -mt-0.5">
                Campus Events & Meetups
              </p>
            </div>
          </div>
          <ul className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <>
                <li>
                  <button
                    onClick={() => onNavigate("calendar")}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2"
                    style={{
                      color: currentPage === "calendar" ? HOVER_COLOR : "white",
                      borderBottom: currentPage === "calendar" ? `2px solid ${HOVER_COLOR}` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== "calendar") e.currentTarget.style.color = HOVER_COLOR;
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== "calendar") e.currentTarget.style.color = "white";
                    }}

                  >
                    Calendar
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => onNavigate("create-event")}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2"
                    style={{
                      color: currentPage === "create-event" ? HOVER_COLOR : "white",
                      borderBottom: currentPage === "create-event" ? `2px solid ${HOVER_COLOR}` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== "create-event") e.currentTarget.style.color = HOVER_COLOR;
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== "create-event") e.currentTarget.style.color = "white";
                    }}
                  >
                    Create Event
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => onNavigate("my-events")}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2"
                    style={{
                      color: currentPage === "my-events" ? HOVER_COLOR : "white",
                      borderBottom: currentPage === "my-events" ? `2px solid ${HOVER_COLOR}` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== "my-events") e.currentTarget.style.color = HOVER_COLOR;
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== "my-events") e.currentTarget.style.color = "white";
                    }}

                  >
                    My Registered Events
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => onNavigate("my-created")}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2"
                    style={{
                      color: currentPage === "my-created" ? HOVER_COLOR : "white",
                      borderBottom: currentPage === "my-created" ? `2px solid ${HOVER_COLOR}` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== "my-created") e.currentTarget.style.color = HOVER_COLOR;
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== "my-created") e.currentTarget.style.color = "white";
                    }}

                  >
                    My Created Events
                  </button>
                </li>
              </>
            )}

            {!isAuthenticated ? (
              <>
                <li>
                  <button
                    onClick={() => onNavigate("register")}
                    className="px-3 py-2 rounded-md text-sm text-white transition"
                    onMouseEnter={(e) => (e.currentTarget.style.color = HOVER_COLOR)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                  >
                    Register
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("login")}
                    className="px-3 py-2 rounded-md text-sm text-white transition"
                    onMouseEnter={(e) => (e.currentTarget.style.color = HOVER_COLOR)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                  >
                    Login
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-md text-sm text-white transition"
                  onMouseEnter={(e) => (e.currentTarget.style.color = HOVER_COLOR)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                >
                  Log out
                </button>
              </li>
            )}
          </ul>

          <div className="md:hidden">
            <button
              onClick={() => onNavigate("calendar")}
              className="px-2 py-1 rounded-md text-sm text-gray-600 transition"
              onMouseEnter={(e) => (e.currentTarget.style.color = HOVER_COLOR)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

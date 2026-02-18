import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "../store/authStore";
import { useEventStore } from "../store/eventStore";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { mockEvents, mockVenues } from "../data/mockData";

import { EventsPage } from "./Pages/EventsPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import LeaderboardPage from "./Pages/LeaderboardPage";
import VenuePage from "./Pages/VenuePage";
import VenueDetailsPage from "./Pages/VenueDetailsPage";
import DashboardPage from "./Pages/DashboardPage";
import ProfilePage from "./Pages/ProfilePage";
import { hasSupabaseEnv, missingSupabaseEnv } from "./lib/supabaseClient";
import { loadEventsFromSupabase, subscribeToEventChanges } from "./lib/eventApi";

import "./index.css";

function App() {
  const { theme } = useAuthStore();
  const { setEvents, setVenues } = useEventStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    setVenues(mockVenues);

    let cleanup: (() => void) | undefined;

    const bootstrapEvents = async () => {
      if (!hasSupabaseEnv) {
        console.warn(`Supabase env missing (${missingSupabaseEnv.join(", ")}), using local mock events.`);
        setEvents(mockEvents);
        return;
      }

      try {
        const initialEvents = await loadEventsFromSupabase(mockVenues);
        setEvents(initialEvents);

        const channel = subscribeToEventChanges(mockVenues, setEvents);
        cleanup = () => {
          channel.unsubscribe();
        };
      } catch (error) {
        console.error("Failed to load events from Supabase, using local mock events.", error);
        setEvents(mockEvents);
      }
    };

    bootstrapEvents();

    return () => {
      cleanup?.();
    };
  }, [setEvents, setVenues]);

  return (
    <Router>
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Navigate to="/login" replace />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/venues" element={<VenuePage />} />
              <Route path="/venues/:id" element={<VenueDetailsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === "dark" ? "#1f2937" : "#ffffff",
              color: theme === "dark" ? "#ffffff" : "#1f2937",
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;

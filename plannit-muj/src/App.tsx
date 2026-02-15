import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "../store/authStore";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

import { EventsPage } from "./Pages/EventsPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import LeaderboardPage from "./Pages/LeaderboardPage";

import VenuePage from "./Pages/VenuePage";
import VenueDetailsPage from "./Pages/VenueDetailsPage";

import DashboardPage from "./Pages/DashboardPage";   // ✅ Dashboard Page
import ProfilePage from "./Pages/ProfilePage";       // ✅ Profile Page

import "./index.css";

function App() {
  const { theme } = useAuthStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Router>
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
          
          {/* Navbar */}
          <Navbar />

          {/* Routes */}
          <main className="flex-1">
            <Routes>

              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Navigate to="/login" replace />} />

              {/* Events */}
              <Route path="/events" element={<EventsPage />} />

              {/* Leaderboard */}
              <Route path="/leaderboard" element={<LeaderboardPage />} />

              {/* Venues */}
              <Route path="/venues" element={<VenuePage />} />
              <Route path="/venues/:id" element={<VenueDetailsPage />} />

              {/* Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Profile */}
              <Route path="/profile" element={<ProfilePage />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </main>

          {/* Footer */}
          <Footer />

        </div>

        {/* Toaster */}
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

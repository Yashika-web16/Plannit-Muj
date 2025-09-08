import  { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HomePage } from '../pages/HomePage';
import { EventsPage } from '../pages/EventsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import "./index.css"
function App() {
  const { theme } = useAuthStore();

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Placeholder routes for future pages */}
              <Route path="/venues" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">Venues Page - Coming Soon!</h1></div>} />
              <Route path="/leaderboard" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">Leaderboard Page - Coming Soon!</h1></div>} />
              <Route path="/dashboard" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">Dashboard Page - Coming Soon!</h1></div>} />
              <Route path="/profile" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">Profile Page - Coming Soon!</h1></div>} />
              
              {/* Catch all - redirect to home */}
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
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
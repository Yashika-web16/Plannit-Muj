import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Trophy, 
  Star, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  const features = [
    {
      icon: Calendar,
      title: 'Event Discovery',
      description: 'Find amazing events happening on campus with smart filters and recommendations.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MapPin,
      title: 'Venue Booking',
      description: 'Book venues easily with real-time availability and interactive campus maps.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow students and join events that match your interests.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Earn points for participation and climb the leaderboard with achievements.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { number: '500+', label: 'Events Hosted' },
    { number: '2000+', label: 'Active Students' },
    { number: '25+', label: 'Venues Available' },
    { number: '95%', label: 'Satisfaction Rate' }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'TechFest 2025',
      date: 'Jan 25, 2025',
      attendees: 145,
      category: 'Technical',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg'
    },
    {
      id: '2',
      title: 'Cultural Night',
      date: 'Jan 28, 2025',
      attendees: 78,
      category: 'Cultural',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg'
    },
    {
      id: '3',
      title: 'Sports Fest',
      date: 'Feb 2, 2025',
      attendees: 92,
      category: 'Sports',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  PlanIt-MUJ
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Your ultimate platform for discovering, organizing, and participating in amazing college events at Manipal University Jaipur
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {isAuthenticated ? (
                <Link to="/events">
                  <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                    Explore Events
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-xl transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed specifically for college event management and student engagement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card hover className="p-6 text-center h-full">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Trending Events
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Don't miss out on these popular upcoming events
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {event.date}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {event.attendees} attending
                        </span>
                      </div>
                      <Link to={`/events/${event.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/events">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight size={20} />}>
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join the Fun?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of MUJ students discovering and creating amazing events every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="bg-white text-purple-600 hover:bg-gray-100"
                      rightIcon={<Zap size={20} />}
                    >
                      Get Started Now
                    </Button>
                  </Link>
                  <Link to="/events">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-purple-600"
                    >
                      Browse Events
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-gray-100"
                    rightIcon={<ArrowRight size={20} />}
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
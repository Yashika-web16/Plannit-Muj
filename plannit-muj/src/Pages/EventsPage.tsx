import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Filter, Heart, MapPin, Search, Star, Users } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { departments, eventCategories } from "../../data/mockData";
import { hasSupabaseEnv } from "../lib/supabaseClient";
import { incrementEventRegistrationInSupabase } from "../lib/eventApi";

const EventsPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    events,
    searchTerm,
    selectedCategory,
    selectedDepartment,
    bookmarkedEvents,
    setSearchTerm,
    setSelectedCategory,
    setSelectedDepartment,
    toggleBookmark,
    registerForEvent,
  } = useEventStore();

  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.tags.some((tag) => tag.toLowerCase().includes(query));

        const matchesCategory = !selectedCategory || event.category === selectedCategory;
        const matchesDepartment = !selectedDepartment || event.department === selectedDepartment;

        return event.isApproved && matchesSearch && matchesCategory && matchesDepartment;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchTerm, selectedCategory, selectedDepartment]);

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast.error("Please login to register.");
      return;
    }

    const targetEvent = events.find((event) => event.id === eventId);
    const result = registerForEvent(eventId, user.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    try {
      if (hasSupabaseEnv && targetEvent) {
        await incrementEventRegistrationInSupabase(eventId, targetEvent.registeredCount);
      }

      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error("Registered locally, but failed to sync seat count to Supabase.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Events</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Real-time seat availability updates as students register.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by event, tag, description"
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters((prev) => !prev)} leftIcon={<Filter size={16} />}>
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="">All Categories</option>
                {eventCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDepartment}
                onChange={(event) => setSelectedDepartment(event.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="">All Departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => {
            const isBookmarked = bookmarkedEvents.includes(event.id);
            const seatsLeft = event.maxCapacity - event.registeredCount;
            const category = eventCategories.find((item) => item.id === event.category);

            return (
              <motion.div key={event.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <Card hover className="overflow-hidden">
                  <div className="relative">
                    <img src={event.image} alt={event.title} className="w-full h-44 object-cover" />
                    {category && (
                      <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full text-white ${category.color}`}>
                        {category.name}
                      </span>
                    )}

                    <button
                      onClick={() => toggleBookmark(event.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90"
                    >
                      <Heart size={16} className={isBookmarked ? "text-red-500 fill-current" : "text-gray-600"} />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{event.description}</p>

                    <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2"><Calendar size={14} />{format(new Date(event.date), "MMM d, yyyy")} • {event.startTime}</div>
                      <div className="flex items-center gap-2"><MapPin size={14} />{event.venue.name}</div>
                      <div className="flex items-center gap-2"><Users size={14} />{event.registeredCount}/{event.maxCapacity} registered</div>
                      <div className="flex items-center gap-2"><Star size={14} className="text-yellow-500" />{event.rating?.toFixed(1) ?? "N/A"}</div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        seatsLeft > 25 ? "bg-green-100 text-green-700" : seatsLeft > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      }`}>
                        {seatsLeft > 0 ? `${seatsLeft} seats left` : "Full"}
                      </span>

                      <Button size="sm" onClick={() => handleRegister(event.id)} disabled={seatsLeft <= 0}>
                        {seatsLeft <= 0 ? "Closed" : "Register"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { EventsPage };

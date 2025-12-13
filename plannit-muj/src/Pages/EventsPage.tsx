// import React, { useState, useMemo } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Search, 
//   Filter, 
//   Calendar,
//   MapPin,
//   Users,
//   Heart,
//   Star,
//   Clock,
//   Plus
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { Button } from '../../components/ui/Button';
// import {Card} from "../../components/ui/Card"
// import { useEventStore } from '../../store/eventStore';
// import { useAuthStore } from '../../store/authStore';
// import { mockEvents, eventCategories, departments } from '../../data/mockData';
// import { formatDistanceToNow, format } from 'date-fns';

// const EventsPage: React.FC = () => {
//   const { user } = useAuthStore();
//   const { 
//     searchTerm, 
//     selectedCategory, 
//     selectedDepartment,
//     bookmarkedEvents,
//     setSearchTerm,
//     setSelectedCategory,
//     setSelectedDepartment,
//     toggleBookmark
//   } = useEventStore();
  
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortBy, setSortBy] = useState('date');

//   // Filter and sort events
//   const filteredEvents = useMemo(() => {
//     let filtered = mockEvents.filter(event => {
//       const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
//       const matchesCategory = !selectedCategory || event.category === selectedCategory;
//       const matchesDepartment = !selectedDepartment || event.department === selectedDepartment;
      
//       return matchesSearch && matchesCategory && matchesDepartment && event.isApproved;
//     });

//     // Sort events
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'date':
//           return new Date(a.date).getTime() - new Date(b.date).getTime();
//         case 'popularity':
//           return b.registeredCount - a.registeredCount;
//         case 'rating':
//           return (b.rating || 0) - (a.rating || 0);
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   }, [searchTerm, selectedCategory, selectedDepartment, sortBy]);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//               Discover Events
//             </h1>
//             <p className="text-gray-600 dark:text-gray-300">
//               Find amazing events happening at MUJ
//             </p>
//           </div>
//           {user?.role === 'organizer' && (
//             <Link to="/events/create">
//               <Button leftIcon={<Plus size={20} />}>
//                 Create Event
//               </Button>
//             </Link>
//           )}
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
//           <div className="flex flex-col lg:flex-row gap-4">
//             {/* Search Bar */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search events by title, description, or tags..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700"
//               />
//             </div>

//             {/* Filter Toggle */}
//             <Button
//               variant="outline"
//               onClick={() => setShowFilters(!showFilters)}
//               leftIcon={<Filter size={20} />}
//             >
//               Filters
//             </Button>
//           </div>

//           {/* Filters */}
//           {showFilters && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Category Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Category
//                   </label>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
//                   >
//                     <option value="">All Categories</option>
//                     {eventCategories.map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.icon} {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Department Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Department
//                   </label>
//                   <select
//                     value={selectedDepartment}
//                     onChange={(e) => setSelectedDepartment(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
//                   >
//                     <option value="">All Departments</option>
//                     {departments.map((dept) => (
//                       <option key={dept} value={dept}>
//                         {dept}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Sort By */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Sort By
//                   </label>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
//                   >
//                     <option value="date">Date</option>
//                     <option value="popularity">Popularity</option>
//                     <option value="rating">Rating</option>
//                   </select>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Events Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredEvents.map((event, index) => {
//             const isBookmarked = bookmarkedEvents.includes(event.id);
//             const category = eventCategories.find(cat => cat.id === event.category);
//             const seatsLeft = event.maxCapacity - event.registeredCount;
            
//             return (
//               <motion.div
//                 key={event.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//               >
//                 <Card hover className="overflow-hidden">
//                   <div className="relative">
//                     <img
//                       src={event.image || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg'}
//                       alt={event.title}
//                       className="w-full h-48 object-cover"
//                     />
                    
//                     {/* Category Badge */}
//                     {category && (
//                       <div className="absolute top-4 left-4">
//                         <span className={`px-3 py-1 ${category.color} text-white text-sm font-medium rounded-full`}>
//                           {category.icon} {category.name}
//                         </span>
//                       </div>
//                     )}

//                     {/* Bookmark Button */}
//                     <button
//                       onClick={() => toggleBookmark(event.id)}
//                       className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
//                     >
//                       <Heart 
//                         size={20} 
//                         className={isBookmarked ? 'text-red-500 fill-current' : 'text-gray-500'} 
//                       />
//                     </button>

//                     {/* Seats Left Badge */}
//                     <div className="absolute bottom-4 right-4">
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         seatsLeft > 50 ? 'bg-green-500 text-white' :
//                         seatsLeft > 10 ? 'bg-yellow-500 text-white' :
//                         'bg-red-500 text-white'
//                       }`}>
//                         {seatsLeft} seats left
//                       </span>
//                     </div>
//                   </div>

//                   <div className="p-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
//                         {event.title}
//                       </h3>
//                       <div className="flex items-center space-x-1">
//                         <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                         <span className="text-sm text-gray-600 dark:text-gray-300">
//                           {event.rating?.toFixed(1) || 'N/A'}
//                         </span>
//                       </div>
//                     </div>

//                     <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
//                       {event.description}
//                     </p>

//                     <div className="space-y-2 mb-4">
//                       <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
//                         <Calendar className="w-4 h-4 mr-2" />
//                         {format(event.date, 'MMM d, yyyy')} at {event.startTime}
//                       </div>
//                       <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
//                         <MapPin className="w-4 h-4 mr-2" />
//                         {event.venue.name}
//                       </div>
//                       <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
//                         <Users className="w-4 h-4 mr-2" />
//                         {event.registeredCount} / {event.maxCapacity} registered
//                       </div>
//                     </div>

//                     {/* Tags */}
//                     <div className="flex flex-wrap gap-1 mb-4">
//                       {event.tags.slice(0, 3).map((tag) => (
//                         <span
//                           key={tag}
//                           className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                       {event.tags.length > 3 && (
//                         <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
//                           +{event.tags.length - 3}
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <img
//                           src={event.organizer.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=40'}
//                           alt={event.organizer.name}
//                           className="w-8 h-8 rounded-full object-cover"
//                         />
//                         <div>
//                           <p className="text-xs text-gray-600 dark:text-gray-300">
//                             by {event.organizer.name}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {formatDistanceToNow(event.createdAt)} ago
//                           </p>
//                         </div>
//                       </div>
                      
//                       <Link to={`/events/${event.id}`}>
//                         <Button size="sm">
//                           View Details
//                         </Button>
//                       </Link>
//                     </div>
//                   </div>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* Empty State */}
//         {filteredEvents.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-12"
//           >
//             <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               No events found
//             </h3>
//             <p className="text-gray-600 dark:text-gray-300">
//               Try adjusting your search or filters to find more events.
//             </p>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };
// export  {EventsPage};
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Search, Filter, Calendar, MapPin, Users, Heart, Star, Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useEventStore } from "../../store/eventStore";
import { useAuthStore } from "../../store/authStore";
import { mockEvents, eventCategories, departments } from "../../data/mockData";
import { formatDistanceToNow, format } from "date-fns";

// NEW IMPORTS FOR REGISTRATION
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const EventsPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    searchTerm,
    selectedCategory,
    selectedDepartment,
    bookmarkedEvents,
    setSearchTerm,
    setSelectedCategory,
    setSelectedDepartment,
    toggleBookmark,
  } = useEventStore();

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");

  // Registration Modal State
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    message: "",
  });

  const openRegistrationForm = (event: any) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const submitRegistration = async () => {
    const { error } = await supabase.from("registrations").insert([
      {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        year: formData.year,
        message: formData.message,
        event_name: selectedEvent?.title,
      },
    ]);

    if (error) {
      toast.error("Registration failed");
    } else {
      toast.success("Successfully registered!");
      setShowForm(false);
    }
  };

  // FILTERS
  const filteredEvents = useMemo(() => {
    let filtered = mockEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        !selectedCategory || event.category === selectedCategory;
      const matchesDepartment =
        !selectedDepartment || event.department === selectedDepartment;

      return matchesSearch && matchesCategory && matchesDepartment && event.isApproved;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "popularity":
          return b.registeredCount - a.registeredCount;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedDepartment, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Discover Events
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Find amazing events happening at MUJ
            </p>
          </div>

          {user?.role === "organizer" && (
            <Link to="/events/create">
              <Button leftIcon={<Plus size={20} />}>Create Event</Button>
            </Link>
          )}
        </div>

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => {
            const category = eventCategories.find(
              (cat) => cat.id === event.category
            );

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card hover>
                  <img
                    src={event.image}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />

                  <div className="p-4">

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                      {event.description}
                    </p>

                    {/* REGISTER BUTTON */}
                    <div className="mt-4 flex justify-between">
                      <Link to={`/events/${event.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRegistrationForm(event)}
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* REGISTRATION MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">

              <h2 className="text-xl font-bold mb-4">
                Register for {selectedEvent?.title}
              </h2>

              <input
                className="w-full p-3 mb-3 border rounded"
                placeholder="Full Name"
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />

              <input
                className="w-full p-3 mb-3 border rounded"
                placeholder="Email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                className="w-full p-3 mb-3 border rounded"
                placeholder="Phone"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <select
                className="w-full p-3 mb-3 border rounded"
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <option>Select Department</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <select
                className="w-full p-3 mb-3 border rounded"
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              >
                <option>Select Year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>

              <textarea
                className="w-full p-3 mb-3 border rounded"
                placeholder="Message (optional)"
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />

              <Button className="w-full mb-2" onClick={submitRegistration}>
                Submit Registration
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { EventsPage };

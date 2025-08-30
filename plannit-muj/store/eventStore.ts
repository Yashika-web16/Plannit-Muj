import { create } from 'zustand';
import type { Event, Venue } from '../types';
// import { Event, Venue, Booking } from '../types';

interface EventState {
  events: Event[];
  venues: Venue[];
  bookmarkedEvents: string[];
  searchTerm: string;
  selectedCategory: string;
  selectedDepartment: string;
  selectedDate: Date | null;
  setEvents: (events: Event[]) => void;
  setVenues: (venues: Venue[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  toggleBookmark: (eventId: string) => void;
  registerForEvent: (eventId: string, userId: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedDepartment: (department: string) => void;
  setSelectedDate: (date: Date | null) => void;
  checkVenueAvailability: (venueId: string, date: Date, startTime: string, endTime: string) => boolean;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  venues: [],
  bookmarkedEvents: [],
  searchTerm: '',
  selectedCategory: '',
  selectedDepartment: '',
  selectedDate: null,
  
  setEvents: (events) => set({ events }),
  setVenues: (venues) => set({ venues }),
  
  addEvent: (event) => set((state) => ({ 
    events: [...state.events, event] 
  })),
  
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    )
  })),
  
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(event => event.id !== id)
  })),
  
  toggleBookmark: (eventId) => set((state) => {
    const isBookmarked = state.bookmarkedEvents.includes(eventId);
    return {
      bookmarkedEvents: isBookmarked
        ? state.bookmarkedEvents.filter(id => id !== eventId)
        : [...state.bookmarkedEvents, eventId]
    };
  }),
  
  registerForEvent: (eventId, userId) => set((state) => ({
    events: state.events.map(event =>
      event.id === eventId
        ? {
            ...event,
            registeredUsers: [...event.registeredUsers, userId],
            registeredCount: event.registeredCount + 1
          }
        : event
    )
  })),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedDepartment: (department) => set({ selectedDepartment: department }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  checkVenueAvailability: (venueId, date, startTime, endTime) => {
    const { venues } = get();
    const venue = venues.find(v => v.id === venueId);
    if (!venue) return false;
    
    // Check for conflicts with existing bookings
    const dateStr = date.toDateString();
    const conflicts = venue.bookings.filter(booking => 
      booking.date.toDateString() === dateStr &&
      booking.status === 'approved' &&
      ((startTime >= booking.startTime && startTime < booking.endTime) ||
       (endTime > booking.startTime && endTime <= booking.endTime) ||
       (startTime <= booking.startTime && endTime >= booking.endTime))
    );
    
    return conflicts.length === 0;
  }
}));
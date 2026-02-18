import { create } from 'zustand';
import type { Booking, Event, Venue } from '../types';

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
  registerForEvent: (eventId: string, userId: string) => { success: boolean; message: string };
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedDepartment: (department: string) => void;
  setSelectedDate: (date: Date | null) => void;
  checkVenueAvailability: (venueId: string, date: Date, startTime: string, endTime: string) => boolean;
  addVenueBooking: (booking: Booking) => void;
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
    events: [...state.events, event],
  })),

  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map((event) =>
      event.id === id ? { ...event, ...updates } : event,
    ),
  })),

  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((event) => event.id !== id),
  })),

  toggleBookmark: (eventId) => set((state) => {
    const isBookmarked = state.bookmarkedEvents.includes(eventId);
    return {
      bookmarkedEvents: isBookmarked
        ? state.bookmarkedEvents.filter((id) => id !== eventId)
        : [...state.bookmarkedEvents, eventId],
    };
  }),

  registerForEvent: (eventId, userId) => {
    const event = get().events.find((item) => item.id === eventId);

    if (!event) {
      return { success: false, message: 'Event not found.' };
    }

    if (event.registeredUsers.includes(userId)) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    if (event.registeredCount >= event.maxCapacity) {
      return { success: false, message: 'No seats left for this event.' };
    }

    set((state) => ({
      events: state.events.map((item) =>
        item.id === eventId
          ? {
              ...item,
              registeredUsers: [...item.registeredUsers, userId],
              registeredCount: item.registeredCount + 1,
            }
          : item,
      ),
    }));

    return { success: true, message: 'Registration successful.' };
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedDepartment: (department) => set({ selectedDepartment: department }),
  setSelectedDate: (date) => set({ selectedDate: date }),

  checkVenueAvailability: (venueId, date, startTime, endTime) => {
    const venue = get().venues.find((item) => item.id === venueId);

    if (!venue) {
      return false;
    }

    const requestedDate = date.toDateString();

    const hasConflict = venue.bookings.some((booking) => {
      const isSameDate = new Date(booking.date).toDateString() === requestedDate;
      if (!isSameDate || booking.status !== 'approved') {
        return false;
      }

      const overlaps =
        (startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime) ||
        (startTime <= booking.startTime && endTime >= booking.endTime);

      return overlaps;
    });

    return !hasConflict;
  },

  addVenueBooking: (booking) => set((state) => ({
    venues: state.venues.map((venue) =>
      venue.id === booking.venueId
        ? { ...venue, bookings: [...venue.bookings, booking] }
        : venue,
    ),
  })),
}));

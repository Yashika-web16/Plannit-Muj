export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'organizer' | 'admin';
  department?: string;
  year?: string;
  avatar?: string;
  points?: number;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  venue: Venue;
  organizer: User;
  category: EventCategory;
  department: string;
  tags: string[];
  maxCapacity: number;
  registeredCount: number;
  image?: string;
  isApproved: boolean;
  registeredUsers: string[];
  likedBy: string[];
  comments: Comment[];
  qrCode?: string;
  rating?: number;
  totalRatings?: number;
  createdAt: Date;
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  type: 'auditorium' | 'seminar-hall' | 'lawn' | 'classroom' | 'sports-complex';
  facilities: string[];
  location: {
    lat: number;
    lng: number;
    building: string;
    floor?: string;
  };
  images: string[];
  bookings: Booking[];
}

export interface Booking {
  id: string;
  eventId: string;
  venueId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}

export type EventCategory = 
  | 'technical' | 'cultural' | 'sports' | 'workshop' 
  | 'seminar' | 'fest' | 'competition' | 'social';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'event-reminder' | 'registration-success' | 'venue-approved' | 'new-event';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}
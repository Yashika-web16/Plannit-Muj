import { Event, Venue, User } from '../types';

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Main Auditorium',
    capacity: 500,
    type: 'auditorium',
    facilities: ['Projector', 'Sound System', 'Air Conditioning', 'Stage Lighting'],
    location: {
      lat: 26.843,
      lng: 75.564,
      building: 'Academic Block A',
      floor: 'Ground Floor'
    },
    images: ['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'],
    bookings: []
  },
  {
    id: '2',
    name: 'Seminar Hall 1',
    capacity: 100,
    type: 'seminar-hall',
    facilities: ['Projector', 'Whiteboard', 'Air Conditioning'],
    location: {
      lat: 26.844,
      lng: 75.565,
      building: 'Academic Block B',
      floor: '1st Floor'
    },
    images: ['https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg'],
    bookings: []
  },
  {
    id: '3',
    name: 'Central Lawn',
    capacity: 1000,
    type: 'lawn',
    facilities: ['Open Air', 'Electrical Points', 'Water Connection'],
    location: {
      lat: 26.845,
      lng: 75.563,
      building: 'Central Campus',
      floor: 'Ground Level'
    },
    images: ['https://images.pexels.com/photos/1708912/pexels-photo-1708912.jpeg'],
    bookings: []
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@jaipur.manipal.edu',
    role: 'organizer',
    department: 'Computer Science',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150',
    points: 450,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@jaipur.manipal.edu',
    role: 'student',
    department: 'Electronics',
    year: '3rd Year',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    points: 280,
    createdAt: new Date('2024-02-10')
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'TechFest 2025: AI & Machine Learning Workshop',
    description: 'Join us for an intensive workshop on AI and Machine Learning fundamentals. Learn from industry experts and get hands-on experience with cutting-edge technologies.',
    date: new Date('2025-01-25'),
    startTime: '10:00',
    endTime: '16:00',
    venue: mockVenues[0],
    organizer: mockUsers[0],
    category: 'technical',
    department: 'Computer Science',
    tags: ['AI', 'Machine Learning', 'Workshop', 'Tech'],
    maxCapacity: 200,
    registeredCount: 145,
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    isApproved: true,
    registeredUsers: ['2', '3', '4'],
    likedBy: ['2', '3', '4', '5'],
    comments: [],
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=event-1',
    rating: 4.8,
    totalRatings: 23,
    createdAt: new Date('2024-12-15')
  },
  {
    id: '2',
    title: 'Cultural Night: Bollywood Dance Competition',
    description: 'Show off your dancing skills in our annual Bollywood dance competition. Prizes for winners and lots of fun for everyone!',
    date: new Date('2025-01-28'),
    startTime: '18:00',
    endTime: '22:00',
    venue: mockVenues[2],
    organizer: mockUsers[1],
    category: 'cultural',
    department: 'All Departments',
    tags: ['Dance', 'Bollywood', 'Competition', 'Cultural'],
    maxCapacity: 500,
    registeredCount: 78,
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    isApproved: true,
    registeredUsers: ['1', '3'],
    likedBy: ['1', '3', '4'],
    comments: [],
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=event-2',
    rating: 4.6,
    totalRatings: 12,
    createdAt: new Date('2024-12-20')
  }
];

export const departments = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Biotechnology',
  'Information Technology',
  'All Departments'
];

export const eventCategories = [
  { id: 'technical', name: 'Technical', icon: '⚙️', color: 'bg-blue-500' },
  { id: 'cultural', name: 'Cultural', icon: '🎭', color: 'bg-purple-500' },
  { id: 'sports', name: 'Sports', icon: '🏆', color: 'bg-green-500' },
  { id: 'workshop', name: 'Workshop', icon: '🛠️', color: 'bg-orange-500' },
  { id: 'seminar', name: 'Seminar', icon: '📊', color: 'bg-red-500' },
  { id: 'fest', name: 'Fest', icon: '🎉', color: 'bg-pink-500' },
  { id: 'competition', name: 'Competition', icon: '🏅', color: 'bg-yellow-500' },
  { id: 'social', name: 'Social', icon: '🤝', color: 'bg-indigo-500' }
];
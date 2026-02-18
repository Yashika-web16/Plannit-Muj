import React, { useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, PlusCircle, ShieldCheck, Users } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { departments, eventCategories, mockUsers } from "../../data/mockData";
import { hasSupabaseEnv } from "../lib/supabaseClient";
import { createEventInSupabase } from "../lib/eventApi";
import type { EventCategory } from "../../types";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  venueId: "",
  category: "technical" as EventCategory,
  department: "Computer Science",
  maxCapacity: 100,
  tags: "",
};

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { events, venues, addEvent, addVenueBooking, checkVenueAvailability } = useEventStore();

  const [form, setForm] = useState(emptyForm);

  const isAdminPortal = user?.role === "admin" || user?.role === "organizer";

  const selectedVenue = useMemo(
    () => venues.find((venue) => venue.id === form.venueId),
    [venues, form.venueId],
  );

  const slotReady = Boolean(form.date && form.startTime && form.endTime && form.venueId);

  const slotAvailable = slotReady
    ? checkVenueAvailability(form.venueId, new Date(form.date), form.startTime, form.endTime)
    : false;

  const organizerEvents = useMemo(() => {
    if (!user) {
      return [];
    }

    return events.filter((event) => event.organizer.id === user.id);
  }, [events, user]);

  const totalRegistrations = useMemo(
    () => organizerEvents.reduce((sum, event) => sum + event.registeredCount, 0),
    [organizerEvents],
  );

  const submitEvent = async () => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (!slotReady) {
      toast.error("Fill date, time and venue details.");
      return;
    }

    if (!slotAvailable) {
      toast.error("Selected venue and slot already booked.");
      return;
    }

    if (!selectedVenue) {
      toast.error("Please choose a valid venue.");
      return;
    }

    const maxCapacity = Math.min(form.maxCapacity, selectedVenue.capacity);

    const newEvent = {
      id: `${Date.now()}`,
      title: form.title,
      description: form.description,
      date: new Date(form.date),
      startTime: form.startTime,
      endTime: form.endTime,
      venue: selectedVenue,
      organizer: {
        ...user,
        avatar: user.avatar ?? mockUsers[0].avatar,
      },
      category: form.category,
      department: form.department,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      maxCapacity,
      registeredCount: 0,
      image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
      isApproved: true,
      registeredUsers: [],
      likedBy: [],
      comments: [],
      rating: 0,
      totalRatings: 0,
      createdAt: new Date(),
    };

    try {
      if (hasSupabaseEnv) {
        await createEventInSupabase(newEvent);
      }

      addEvent(newEvent);
      addVenueBooking({
      id: `booking-${Date.now()}`,
      eventId: newEvent.id,
      venueId: selectedVenue.id,
      date: new Date(form.date),
      startTime: form.startTime,
      endTime: form.endTime,
      status: "approved",
      requestedBy: user.id,
      requestedAt: new Date(),
    });

      setForm(emptyForm);
      toast.success("Event published and venue booked in real-time.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish event to Supabase events table.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
        <Card className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Dashboard access</h1>
          <p className="text-gray-600 dark:text-gray-300">Please login to access your dashboard.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isAdminPortal
                ? "Admin portal for event publishing and venue scheduling"
                : "Track your registrations and live seat availability"}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
            <ShieldCheck size={16} />
            {user.role.toUpperCase()}
          </span>
        </div>

        {isAdminPortal ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-500">Events published</p>
                <p className="text-3xl font-bold mt-1">{organizerEvents.length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-500">Total student registrations</p>
                <p className="text-3xl font-bold mt-1">{totalRegistrations}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-500">Venues available</p>
                <p className="text-3xl font-bold mt-1">{venues.length}</p>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PlusCircle size={20} /> Post a New Event
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border rounded-lg px-3 py-2" placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input className="border rounded-lg px-3 py-2" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                <textarea className="md:col-span-2 border rounded-lg px-3 py-2" rows={3} placeholder="Event description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

                <input type="date" className="border rounded-lg px-3 py-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="time" className="border rounded-lg px-3 py-2" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                  <input type="time" className="border rounded-lg px-3 py-2" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                </div>

                <select className="border rounded-lg px-3 py-2" value={form.venueId} onChange={(e) => setForm({ ...form, venueId: e.target.value })}>
                  <option value="">Select venue</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>{venue.name} • max {venue.capacity}</option>
                  ))}
                </select>

                <input
                  type="number"
                  className="border rounded-lg px-3 py-2"
                  min={1}
                  max={selectedVenue?.capacity ?? 500}
                  value={form.maxCapacity}
                  onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) || 1 })}
                />

                <select className="border rounded-lg px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })}>
                  {eventCategories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>

                <select className="border rounded-lg px-3 py-2" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                  {departments.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>

              <div className={`mt-4 p-3 rounded-lg border ${slotReady ? (slotAvailable ? "bg-green-50 border-green-300 text-green-700" : "bg-red-50 border-red-300 text-red-700") : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                <p className="font-semibold">Venue slot status</p>
                <p className="text-sm">
                  {slotReady
                    ? slotAvailable
                      ? "Available ✅ - safe to publish this event."
                      : "Not available ❌ - please change venue or timings."
                    : "Select date, time, and venue to check real-time availability."}
                </p>
              </div>

              <Button className="mt-4" onClick={submitEvent}>Publish Event</Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Live event operations</h2>
              <div className="space-y-3">
                {organizerEvents.length === 0 ? (
                  <p className="text-gray-600">No events posted yet.</p>
                ) : (
                  organizerEvents.map((event) => (
                    <div key={event.id} className="flex flex-wrap gap-3 justify-between items-center border rounded-lg p-3">
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.venue.name} • {event.startTime} - {event.endTime}</p>
                      </div>
                      <div className="flex items-center gap-5 text-sm">
                        <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {new Date(event.date).toLocaleDateString()}</span>
                        <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {event.startTime}</span>
                        <span className="inline-flex items-center gap-1"><Users size={14} /> {event.registeredCount}/{event.maxCapacity}</span>
                        <span className="inline-flex items-center gap-1"><MapPin size={14} /> {event.venue.name}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Your student dashboard</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Register from the Events page. All seat updates are reflected instantly here and for organizers.
            </p>
            <div className="space-y-3">
              {events
                .filter((event) => event.registeredUsers.includes(user.id))
                .map((event) => (
                  <div key={event.id} className="border rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} • {event.venue.name}</p>
                    </div>
                    <span className="text-sm text-gray-700">Seat status: {event.maxCapacity - event.registeredCount} left</span>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

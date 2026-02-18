import type { RealtimeChannel } from "@supabase/supabase-js";
import { mockUsers } from "../../data/mockData";
import type { Event, EventCategory, User, Venue } from "../../types";
import { supabase } from "./supabaseClient";

export interface EventRow {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  venue_id: string;
  category: EventCategory;
  department: string;
  tags: string[] | null;
  max_capacity: number;
  registered_count: number;
  image: string | null;
  is_approved: boolean;
  organizer_id: string;
  organizer_name: string;
  organizer_email: string;
  created_at: string;
}

const fallbackOrganizer: User = {
  ...mockUsers[0],
  role: "organizer",
};

const toEvent = (row: EventRow, venues: Venue[]): Event => {
  const venue = venues.find((item) => item.id === row.venue_id) ?? venues[0];

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: new Date(row.date),
    startTime: row.start_time,
    endTime: row.end_time,
    venue,
    organizer: {
      ...fallbackOrganizer,
      id: row.organizer_id,
      name: row.organizer_name,
      email: row.organizer_email,
    },
    category: row.category,
    department: row.department,
    tags: row.tags ?? [],
    maxCapacity: row.max_capacity,
    registeredCount: row.registered_count,
    image: row.image ?? undefined,
    isApproved: row.is_approved,
    registeredUsers: [],
    likedBy: [],
    comments: [],
    rating: 0,
    totalRatings: 0,
    createdAt: new Date(row.created_at),
  };
};

export const loadEventsFromSupabase = async (venues: Venue[]): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as EventRow[]).map((row) => toEvent(row, venues));
};

export const createEventInSupabase = async (event: Event) => {
  const payload = {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    start_time: event.startTime,
    end_time: event.endTime,
    venue_id: event.venue.id,
    category: event.category,
    department: event.department,
    tags: event.tags,
    max_capacity: event.maxCapacity,
    registered_count: event.registeredCount,
    image: event.image ?? null,
    is_approved: event.isApproved,
    organizer_id: event.organizer.id,
    organizer_name: event.organizer.name,
    organizer_email: event.organizer.email,
    created_at: event.createdAt.toISOString(),
  };

  const { error } = await supabase.from("events").insert([payload]);

  if (error) {
    throw error;
  }
};

export const incrementEventRegistrationInSupabase = async (eventId: string, currentRegisteredCount: number) => {
  const { error } = await supabase
    .from("events")
    .update({ registered_count: currentRegisteredCount + 1 })
    .eq("id", eventId);

  if (error) {
    throw error;
  }
};

export const subscribeToEventChanges = (
  venues: Venue[],
  onEvents: (events: Event[]) => void,
): RealtimeChannel => {
  const channel = supabase
    .channel("events-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "events" },
      async () => {
        const events = await loadEventsFromSupabase(venues);
        onEvents(events);
      },
    )
    .subscribe();

  return channel;
};

import React from "react";
import { useParams } from "react-router-dom";
import * as venuesData from "../data/venuesData";
import { MapPin, Users } from "lucide-react";

const VenueDetailsPage: React.FC = () => {
  const { id } = useParams();

  const venue = venuesData.venuesData.find((v) => v.id === id);

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Venue not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-64 object-cover rounded-lg"
        />

        <h1 className="text-3xl font-bold mt-6 text-gray-900 dark:text-white">
          {venue.name}
        </h1>

        <div className="flex items-center gap-4 mt-4 text-gray-700 dark:text-gray-300">
          <Users /> <span>Capacity: {venue.capacity}</span>
        </div>

        <div className="flex items-center gap-4 mt-2 text-gray-700 dark:text-gray-300">
          <MapPin /> <span>Location: {venue.location}</span>
        </div>

        <p className="mt-6 text-gray-700 dark:text-gray-300">
          {venue.description}
        </p>
      </div>
    </div>
  );
};

export default VenueDetailsPage;

import React from "react";
import { Card } from "../../components/ui/Card";
import { MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

const venues = [
  {
    id: "football-ground",
    name: "Football Ground",
    capacity: "300+ people",
    location: "Sports Complex",
    image: "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress",
  },
  {
    id: "cricket-ground",
    name: "Cricket Ground",
    capacity: "500+ people",
    location: "Sports Complex",
    image: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress",
  },
  {
    id: "amphi",
    name: "Amphitheatre",
    capacity: "400 seats",
    location: "Central Block",
    image: "https://images.pexels.com/photos/1763060/pexels-photo-1763060.jpeg?auto=compress",
  },
  {
    id: "tma-pai",
    name: "TMA Pai Auditorium",
    capacity: "1000 seats",
    location: "TMA Pai Block",
    image: "https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg?auto=compress",
  },
  {
    id: "old-mess",
    name: "Old Mess Auditorium",
    capacity: "350 seats",
    location: "Old Mess Area",
    image: "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress",
  },
  {
    id: "main-auditorium",
    name: "Main Auditorium",
    capacity: "1500 seats",
    location: "Main Block",
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress",
  },
];

const VenuePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        Venues at MUJ
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden shadow-lg">
            <img
              src={venue.image}
              alt={venue.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {venue.name}
              </h2>

              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
                <Users size={18} className="mr-2" />
                <span>{venue.capacity}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
                <MapPin size={18} className="mr-2" />
                <span>{venue.location}</span>
              </div>

              <Link to={`/venues/${venue.id}`}>
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                  View Details
                </button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VenuePage;

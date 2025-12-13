import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Bell, CreditCard, Hand, Star } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../lib/supabaseClient";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import toast from "react-hot-toast";

interface Registration {
  id: number;
  event_name: string;
  full_name: string;
  department: string;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user registrations from Supabase
  const loadRegistrations = async () => {
    if (!user?.email) return;

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("email", user.email);

    if (error) {
      toast.error("Failed to load registrations");
      return;
    }

    setRegistrations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome, {user?.name?.split(" ")[0]} 👋
      </h1>

      {/* ONO FEST BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg mb-10"
      >
        <h2 className="text-3xl font-bold mb-2">🎉 ONO MUJ 2026 is Coming!</h2>
        <p className="text-lg">MUJ’s biggest cultural & music festival — February 2025</p>

        <Button className="mt-4 bg-white text-purple-700 hover:bg-gray-200">
          Explore ONO Events
        </Button>
      </motion.div>

      {/* DASHBOARD SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Notifications */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <Bell size={22} className="text-blue-600" />
          </div>
          <p className="text-gray-600 mt-2">
            No new notifications 📭
          </p>
        </Card>

        {/* Points */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Points</h3>
            <Star className="text-yellow-500" size={24} />
          </div>
          <p className="text-3xl font-bold mt-3">{user?.points || 0}</p>
          <p className="text-gray-600">Earn points by attending events</p>
        </Card>

        {/* Volunteer Section */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Become a Volunteer</h3>
            <Hand className="text-green-600" size={24} />
          </div>
          <p className="mt-2 text-gray-600">
            Help at ONO Fest and get certificates!
          </p>
          <Button className="mt-4 w-full">Register as Volunteer</Button>
        </Card>
      </div>

      {/* YOUR EVENT REGISTRATIONS */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Your Event Registrations
      </h2>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : registrations.length === 0 ? (
          <p className="text-gray-600">You haven't registered for any events yet.</p>
        ) : (
          registrations.map((reg) => (
            <Card key={reg.id} className="p-5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{reg.event_name}</h3>
                <p className="text-gray-600">
                  Registered on: {new Date(reg.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline">View Event</Button>
            </Card>
          ))
        )}
      </div>

      {/* Payments */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
        Payments
      </h2>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <CreditCard size={28} className="text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold">Pending Payments</h3>
            <p className="text-gray-600">No pending payments 🎉</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;

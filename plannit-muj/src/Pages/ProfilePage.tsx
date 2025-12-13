import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../lib/supabaseClient";
import {
  Mail,
  User,
  Edit,
  GraduationCap,
  Calendar,
  Star,
  Phone,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

interface Registration {
  id: number;
  event_name: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    department: user?.department || "",
    year: user?.year || "",
    phone: "",
  });

  // Load registrations
  const loadRegistrations = async () => {
    if (!user?.email) return;

    const { data, error } = await supabase
      .from("registrations")
      .select("id, event_name, created_at")
      .eq("email", user.email);

    if (!error) setRegistrations(data || []);
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  // Handle Edit Save
  const handleSave = async () => {
    updateUser({
      name: editData.name,
      department: editData.department,
      year: editData.year,
    });

    toast.success("Profile updated successfully!");
    setEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Your Profile
      </h1>

      {/* TOP SECTION */}
      <Card className="p-6 mb-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h2>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
              <Mail size={18} className="mr-2" />
              {user?.email}
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
              <Star size={18} className="mr-2 text-yellow-500" />
              {user?.points || 0} points
            </div>
          </div>

          <Button
            className="ml-auto"
            leftIcon={<Edit size={18} />}
            onClick={() => setEditOpen(true)}
          >
            Edit
          </Button>
        </div>
      </Card>

      {/* USER DETAILS */}
      <Card className="p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4">Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Building2 className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-semibold">{user?.department || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GraduationCap className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-semibold">{user?.year || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Joined On</p>
              <p className="font-semibold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* EVENT REGISTRATIONS */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Your Event Registrations
      </h2>

      {registrations.length === 0 ? (
        <p className="text-gray-600">No registrations yet.</p>
      ) : (
        <div className="space-y-4">
          {registrations.map((r) => (
            <Card key={r.id} className="p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{r.event_name}</h3>
                <p className="text-gray-600">
                  Registered on: {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>

              <Button variant="outline">View</Button>
            </Card>
          ))}
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <input
              className="w-full p-3 border rounded mb-3"
              placeholder="Full Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />

            <input
              className="w-full p-3 border rounded mb-3"
              placeholder="Department"
              value={editData.department}
              onChange={(e) =>
                setEditData({ ...editData, department: e.target.value })
              }
            />

            <input
              className="w-full p-3 border rounded mb-3"
              placeholder="Year"
              value={editData.year}
              onChange={(e) => setEditData({ ...editData, year: e.target.value })}
            />

            <div className="flex gap-3 mt-4">
              <Button className="w-full" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

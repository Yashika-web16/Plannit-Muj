import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Trophy, Medal } from "lucide-react";

type RegistrationRow = {
  id: number;
  email: string;
  full_name: string;
  department: string;
};

type LeaderboardUser = {
  id: string;
  name: string;
  department: string;
  points: number;
  registrations: number;
};

const POINTS_PER_REGISTRATION = 10;

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const buildLeaderboard = (rows: RegistrationRow[]): LeaderboardUser[] => {
    const grouped = rows.reduce<Record<string, LeaderboardUser>>((acc, row) => {
      const key = row.email?.toLowerCase() || `anon-${row.id}`;

      if (!acc[key]) {
        acc[key] = {
          id: key,
          name: row.full_name || row.email || "Student",
          department: row.department || "Unknown Department",
          points: 0,
          registrations: 0,
        };
      }

      acc[key].registrations += 1;
      acc[key].points = acc[key].registrations * POINTS_PER_REGISTRATION;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => b.points - a.points);
  };

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("registrations")
      .select("id, email, full_name, department");

    if (error) {
      console.error("Leaderboard fetch error:", error);
      setLoading(false);
      return;
    }

    setUsers(buildLeaderboard((data || []) as RegistrationRow[]));
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel("registrations-leaderboard-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
          <Trophy className="text-yellow-500" />
          MUJ Leaderboard
        </h1>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading leaderboard...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No students on leaderboard yet.</p>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-3">
                  {index === 0 && <Medal className="text-yellow-500" />}
                  {index === 1 && <Medal className="text-gray-300" />}
                  {index === 2 && <Medal className="text-amber-600" />}

                  {index > 2 && (
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">#{index + 1}</span>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{user.department}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.registrations} registrations
                    </p>
                  </div>
                </div>

                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{user.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

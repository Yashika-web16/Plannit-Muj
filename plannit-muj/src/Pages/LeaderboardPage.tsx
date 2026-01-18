import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Trophy, Medal } from "lucide-react";

type RegistrationUser = {
  id: string;
  name: string;
  department: string;
  points: number;
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState<RegistrationUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data from REGISTRATIONS table
  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("registrations")
      .select("id, name, department, points")
      .order("points", { ascending: false });

    if (error) {
      console.error("Leaderboard fetch error:", error);
    }

    if (data) {
      setUsers(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch
    fetchUsers();

    // Realtime subscription on REGISTRATIONS table
    const channel = supabase
      .channel("registrations-leaderboard-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT | UPDATE | DELETE
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

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
          <Trophy className="text-yellow-500" />
          MUJ Leaderboard
        </h1>

        {/* Loading */}
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading leaderboard...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No students on leaderboard yet.
          </p>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow"
              >
                {/* Rank + User Info */}
                <div className="flex items-center gap-3">
                  {/* Medals */}
                  {index === 0 && <Medal className="text-yellow-500" />}
                  {index === 1 && <Medal className="text-gray-300" />}
                  {index === 2 && <Medal className="text-amber-600" />}

                  {/* Rank number */}
                  {index > 2 && (
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                      #{index + 1}
                    </span>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {user.department}
                    </p>
                  </div>
                </div>

                {/* Points */}
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {user.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

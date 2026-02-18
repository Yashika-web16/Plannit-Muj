import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const demoCredentials = [
    {
      email: "student@jaipur.manipal.edu",
      password: "Student@123",
      name: "Demo Student",
      role: "student" as const,
      department: "Computer Science",
      year: "3rd",
    },
    {
      email: "admin@plannitmuj.com",
      password: "Admin@123",
      name: "Campus Admin",
      role: "admin" as const,
      department: "Student Affairs",
      year: "",
    },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedEmail || !trimmedEmail.includes("@")) {
        toast.error("Please enter a valid email id.");
        return;
      }

      const matchedUser = demoCredentials.find(
        (credential) =>
          credential.email === trimmedEmail && credential.password === password
      );

      if (!matchedUser) {
        toast.error("Invalid email or password. Please use the demo credentials.");
        return;
      }

      login({
        id: `email-${btoa(matchedUser.email)}`,
        name: matchedUser.name,
        email: trimmedEmail,
        role: matchedUser.role,
        department: matchedUser.department,
        year: matchedUser.year,
        points: 0,
        createdAt: new Date(),
      });

      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Unable to login right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Login to PlanIt-MUJ</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="your.name@jaipur.manipal.edu"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <Button className="w-full" type="submit" isLoading={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-semibold mb-2">Demo login credentials</p>
            <p>
              <span className="font-medium">Student:</span>{" "}
              student@jaipur.manipal.edu / Student@123
            </p>
            <p>
              <span className="font-medium">Admin:</span> admin@plannitmuj.com /
              Admin@123
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
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

      const displayName = trimmedEmail.split("@")[0] || "User";

      login({
        id: `email-${btoa(trimmedEmail)}`,
        name: displayName,
        email: trimmedEmail,
        role: "student",
        department: "",
        year: "",
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

            <Button className="w-full" type="submit" isLoading={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-300">
            Sign up is temporarily disabled.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;

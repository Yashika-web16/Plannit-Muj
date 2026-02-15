import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../lib/supabaseClient";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* --------------------------------------------------
       🔐 TEMPORARY HARDCODED LOGIN (Works Without Supabase)
       -------------------------------------------------- */
      if (email === "test@jaipur.manipal.edu" && password === "test1234") {
        login({
          id: "hardcoded-user-001",
          name: "Test User",
          email: "test@jaipur.manipal.edu",
          role: "student",
          department: "Computer Science",
          year: "2nd Year",
          points: 0,
          createdAt: new Date(),
        });

        toast.success("Logged in successfully!");
        navigate("/dashboard");
        return;
      }

      /* --------------------------------------------------
        REAL LOGIN (Supabase Auth)
      --------------------------------------------------- */
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        toast.error(authError.message);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        toast.error("Login failed.");
        return;
      }

      // Fetch profile from users table
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.warn("User profile lookup warning:", fetchError.message);
      }

      const metadata = authData.user?.user_metadata ?? {};

      if (!userData) {
        const fallbackProfile = {
          id: userId,
          full_name: metadata.full_name || authData.user?.email?.split("@")[0] || "User",
          email: authData.user?.email || email,
          role: (metadata.role as "student" | "organizer") || "student",
          department: metadata.department || "",
          year: metadata.year || "",
          points: 0,
          created_at: new Date().toISOString(),
        };

        await supabase.from("users").upsert([fallbackProfile]);
      }

      // Save inside Zustand
      login({
        id: userId,
        name: userData?.full_name || metadata.full_name || authData.user?.email?.split("@")[0] || "User",
        email: userData?.email || authData.user?.email || email,
        role: userData?.role || (metadata.role as "student" | "organizer") || "student",
        department: userData?.department || metadata.department || "",
        year: userData?.year || metadata.year || "",
        points: userData?.points || 0,
        createdAt: userData?.created_at || new Date().toISOString(),
      });

      toast.success("Welcome back!");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
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

          <h1 className="text-2xl font-bold text-center mb-6">
            Login to PlanIt-MUJ
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Input */}
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

            {/* Password Input */}
            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border rounded-lg"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button className="w-full" type="submit" isLoading={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>

        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;

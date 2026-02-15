import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAuthStore } from "../../store/authStore";
import { departments } from "../../data/mockData";
import toast from "react-hot-toast";
import { hasSupabaseEnv, missingSupabaseEnv, supabase } from "../lib/supabaseClient";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "organizer",
    department: "",
    year: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (rateLimitUntil && Date.now() < rateLimitUntil) {
        toast.error("Please wait a minute before trying signup again.");
        return;
      }

      if (!hasSupabaseEnv) {
        toast.error(`App config missing: ${missingSupabaseEnv.join(", ")}`);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      // 🔹 1: Create Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: formData.role,
            department: formData.department,
            year: formData.role === "student" ? formData.year : null,
          },
        },
      });

      if (authError) {
        const authMessage = authError.message.toLowerCase();
        const isRateLimited = authError.status === 429 || authMessage.includes("rate limit");

        if (isRateLimited) {
          setRateLimitUntil(Date.now() + 60_000);
          toast.error("Email rate limit exceeded. Check your inbox for an existing verification mail, or wait ~60 seconds before trying again.");
        } else {
          toast.error(authError.message);
        }
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        toast.error("User not created");
        return;
      }

      // 🔹 2: Insert into public.users (best effort)
      const { error: insertError } = await supabase
        .from("users")
        .upsert([
          {
            id: userId,
            full_name: formData.name,
            email: formData.email,
            role: formData.role,
            department: formData.department,
            year: formData.role === "student" ? formData.year : null,
            points: 0,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        // Don't fail sign up if row-level security blocks this step.
        console.warn("Profile insert warning:", insertError.message);
      }

      // 🔹 3: Local login only when session exists
      if (!authData.session) {
        toast.success("Account created! Please verify your email, then login.");
        navigate("/login");
        return;
      }

      login({
        id: userId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        year: formData.year,
        points: 0,
        createdAt: new Date(),
      });

      toast.success("Account created successfully! 🎉");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong.";
      if (message.toLowerCase().includes("failed to fetch")) {
        toast.error("Unable to reach Supabase. In Vercel, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Project Settings → Environment Variables, then redeploy.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex justify-center items-center">
                <Calendar className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PlanIt-MUJ
              </span>
            </div>
            <h1 className="text-2xl font-bold">Create Your Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium">MUJ Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="your.name@jaipur.manipal.edu"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block mb-2 text-sm font-medium">Role</label>
              <select
                name="role"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="student">Student</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block mb-2 text-sm font-medium">Department</label>
              <select
                name="department"
                required
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Department</option>
                {departments
                  .filter((d) => d !== "All Departments")
                  .map((dept) => (
                    <option key={dept}>{dept}</option>
                  ))}
              </select>
            </div>

            {/* Year (students only) */}
            {formData.role === "student" && (
              <div>
                <label className="block mb-2 text-sm font-medium">Year</label>
                <select
                  name="year"
                  required
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select Year</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={handleChange}
                  className="w-full pl-10 py-3 pr-12 border rounded-lg"
                  placeholder="Enter password"
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

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border rounded-lg"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {/* Submit */}
            <Button className="w-full" type="submit" isLoading={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

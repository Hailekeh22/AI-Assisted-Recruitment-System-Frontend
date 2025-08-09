"use client";

import Nav from "@/components/Nav/Nav";
import { useLoginUserMutation } from "@/services/authAPI";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginUser({ email, password }).unwrap();

      // Redirect based on user role
      const role = result.user?.role;
      if (role === "admin") {
        window.location.href = "/admin";
      } else if (role === "employer") {
        window.location.href = "/employer";
      } else if (role === "jobseeker") {
        window.location.href = "/user";
      }
    } catch (error: any) {
      alert(error?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black/10 px-4">
        <div className="w-full max-w-md bg-white dark:bg-[#141414] rounded-xl shadow-md dark:shadow-white/20 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-50 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-50 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Create your account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              for Employer
            </a>
            {"   "}
            <a href="/register" className="text-blue-600 hover:underline">
              for Job-Seeker
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

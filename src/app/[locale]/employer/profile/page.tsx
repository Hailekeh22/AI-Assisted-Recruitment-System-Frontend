"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useGetEmployerProfileQuery, useUpdateEmployerProfileMutation } from "@/services/profileAPI";

const EmployerProfilePage = () => {
  const { data, error, isLoading, isFetching } = useGetEmployerProfileQuery();
  const [updateProfile] = useUpdateEmployerProfileMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formState, setFormState] = useState({ first_name: "", last_name: "", profile_picture: null as File | null });

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-red-500">Failed to fetch employer profile.</p>
      </div>
    );
  }

  const profile = data?.data;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-300">No profile data found.</p>
      </div>
    );
  }

  // Open edit modal with current profile info
  const handleEditClick = () => {
    setFormState({
      first_name: profile.first_name,
      last_name: profile.last_name,
      profile_picture: null,
    });
    setIsEditOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormState({ ...formState, profile_picture: e.target.files[0] });
    }
  };

  const handleSave = async () => {
    try {
      if (!profile.user_id) return;
      const payload = {
        id: profile.user_id,
        first_name: formState.first_name,
        last_name: formState.last_name,
        profile_picture: formState.profile_picture || undefined,
      };
      await updateProfile(payload).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen w-full p-8 flex justify-center bg-gray-50 dark:bg-gray-950">
      <Card className="w-full max-w-6xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141414]">
        <CardHeader className="flex flex-col md:flex-row items-center md:items-start gap-8 p-10">
          {/* Profile Picture */}
          <div className="relative w-40 h-40">
            {profile.profile_picture ? (
              <Image
                src={profile.profile_picture}
                alt={`${profile.first_name}'s profile picture`}
                fill
                className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-md"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 text-xl font-bold shadow-md">
                {profile.first_name[0]}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{profile.first_name} {profile.last_name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{profile.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              <span className="px-4 py-1 text-sm font-semibold text-indigo-800 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-900/60 rounded-full">
                {profile.role}
              </span>
              {profile.isVerified && (
                <span className="px-4 py-1 text-sm font-semibold text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/60 rounded-full">
                  Verified
                </span>
              )}
            </div>
            <Button className="mt-6 px-6 py-2" onClick={handleEditClick}>
              Edit Profile
            </Button>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 border-t border-gray-200 dark:border-gray-800">
          {/* Profile Details */}
          <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
            <p className="font-semibold text-gray-900 dark:text-white break-all">{profile.user_id}</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
            <p className="font-semibold text-gray-900 dark:text-white">{profile.company_name}</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Job Posts</p>
            <p className="font-semibold text-gray-900 dark:text-white">{profile.employers.remaining_job_posts}</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">Joined On</p>
            <p className="font-semibold text-gray-900 dark:text-white">{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              name="first_name"
              value={formState.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="dark:bg-gray-800 dark:text-white"
            />
            <Input
              name="last_name"
              value={formState.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="dark:bg-gray-800 dark:text-white"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 text-sm text-gray-700 dark:text-gray-200"
            />
          </div>
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerProfilePage;

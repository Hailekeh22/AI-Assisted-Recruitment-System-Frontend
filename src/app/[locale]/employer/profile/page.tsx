"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useGetEmployerProfileQuery, useUpdateEmployerProfileMutation } from "@/services/profileAPI";

const page = () => {
  const { data, error, isLoading, isFetching } = useGetEmployerProfileQuery();
  const [updateProfile] = useUpdateEmployerProfileMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formState, setFormState] = useState({ first_name: "", last_name: "", profile_picture: null as File | null });

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">Failed to fetch employer profile.</p>
      </div>
    );
  }

  const profile = data?.data;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
        profile_picture: formState.profile_picture || undefined
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
    <div className="min-h-screen w-full p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-32 h-32">
            {profile.profile_picture ? (
              <Image
                src={profile.profile_picture}
                alt={`${profile.first_name}'s profile picture`}
                fill
                className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200">
                N/A
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">{profile.first_name} {profile.last_name}</h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">{profile.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
              <span className="px-3 py-1 text-sm font-semibold text-indigo-800 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-900 rounded-full">{profile.role}</span>
              {profile.isVerified && (
                <span className="px-3 py-1 text-sm font-semibold text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900 rounded-full">Verified</span>
              )}
            </div>
            <Button className="mt-4" onClick={handleEditClick}>Edit Profile</Button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
            <p className="font-medium text-gray-800 dark:text-gray-100 break-all">{profile.user_id}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{profile.company_name}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Job Posts</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{profile.employers.remaining_job_posts}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Joined On</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Input
                name="first_name"
                value={formState.first_name}
                onChange={handleChange}
                placeholder="First Name"
              />
              <Input
                name="last_name"
                value={formState.last_name}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 text-gray-700 dark:text-gray-200"
              />
            </div>
            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default page;

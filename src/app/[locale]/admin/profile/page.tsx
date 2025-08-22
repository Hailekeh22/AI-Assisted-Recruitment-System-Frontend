"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} from "@/services/profileAPI";
import { toast } from "sonner";

const MyAccountPage = () => {
  const { data } = useGetAdminProfileQuery();
  const [updateProfile] = useUpdateAdminProfileMutation();

  const profile = data?.data;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    profile_picture: null as File | null,
    previewUrl: "",
  });

  if (!profile) return null;

  const handleEditClick = () => {
    setFormState({
      first_name: profile.first_name,
      last_name: profile.last_name,
      profile_picture: null,
      previewUrl: profile.profile_picture || "",
    });
    setIsEditOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormState({
      ...formState,
      profile_picture: file,
      previewUrl: file
        ? URL.createObjectURL(file)
        : profile.profile_picture || "",
    });
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        id: profile.user_id,
        first_name: formState.first_name,
        last_name: formState.last_name,
        profile_picture: formState.profile_picture || undefined,
      }).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full p-8 flex justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-6xl bg-white dark:bg-[#141414] rounded-2xl shadow-xl p-10 flex flex-col gap-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative w-40 h-40">
            {profile.profile_picture ? (
              <Image
                src={profile.profile_picture}
                alt={`${profile.first_name}'s profile picture`}
                fill
                className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-md"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 text-2xl font-bold shadow-md">
                {profile.first_name?.[0] || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {profile.email}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              <span className="px-4 py-1 text-sm font-semibold text-indigo-800 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-900/60 rounded-full">
                {profile.role}
              </span>
              {profile.admins?.is_superadmin && (
                <span className="px-4 py-1 text-sm font-semibold text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/60 rounded-full">
                  Super Admin
                </span>
              )}
            </div>
            <Button className="mt-6 px-6 py-2" onClick={handleEditClick}>
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Details */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Profile Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
              <p className="font-semibold text-gray-900 dark:text-white break-all">
                {profile.user_id}
              </p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Joined On
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Edit Profile
              </DialogTitle>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="dark:text-gray-200"
                />
                {formState.previewUrl && (
                  <img
                    src={formState.previewUrl}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-full border dark:border-gray-600"
                  />
                )}
              </div>
            </div>
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyAccountPage;

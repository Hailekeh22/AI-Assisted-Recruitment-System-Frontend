"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAdminProfileQuery, useUpdateAdminProfileMutation } from "@/services/profileAPI";
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
    previewUrl: ""
  });

  if (!profile) return null;

  const handleEditClick = () => {
    setFormState({
      first_name: profile.first_name,
      last_name: profile.last_name,
      profile_picture: null,
      previewUrl: profile.profile_picture || ""
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
      previewUrl: file ? URL.createObjectURL(file) : profile.profile_picture || ""
    });
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        id: profile.user_id,
        first_name: formState.first_name,
        last_name: formState.last_name,
        profile_picture: formState.profile_picture || undefined
      }).unwrap();

      toast("Your profile has been updated successfully.")

      setIsEditOpen(false);
    } catch (err: any) {
      toast("Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-screen  p-10 flex justify-center items-start">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Profile Info */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 flex flex-col items-center">
          <div className="relative w-48 h-48">
            {profile.profile_picture ? (
              <Image
                src={profile.profile_picture}
                alt={`${profile.first_name}'s profile picture`}
                width={192}
                height={192}
                className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-48 h-48 rounded-full border-4 border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 font-bold text-4xl">
                {profile.first_name?.[0] || "U"}
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-6">{profile.first_name} {profile.last_name}</h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2">{profile.email}</p>
          <div className="flex items-center justify-center space-x-3 mt-4">
            <span className="px-4 py-1 text-sm font-semibold text-indigo-800 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-700 rounded-full">{profile.role}</span>
            {profile.admins?.is_superadmin && (
              <span className="px-4 py-1 text-sm font-semibold text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-700 rounded-full">Super Admin</span>
            )}
          </div>
          <Button className="mt-6" onClick={handleEditClick}>Edit Profile</Button>
        </div>

        {/* Right Side: Profile Details */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100">Profile Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-300">User ID</p>
              <p className="font-medium text-gray-800 dark:text-gray-100 break-all">{profile.user_id}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-300">Joined On</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-300">First Name</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{profile.first_name}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-300">Last Name</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{profile.last_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-100">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              name="first_name"
              value={formState.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="dark:bg-gray-700 dark:text-gray-100"
            />
            <Input
              name="last_name"
              value={formState.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="dark:bg-gray-700 dark:text-gray-100"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="dark:text-gray-100" />
              {formState.previewUrl && (
                <img src={formState.previewUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-full border dark:border-gray-600" />
              )}
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAccountPage;

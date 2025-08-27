"use client";

import { useState, useEffect } from "react";
import {
  useGetJobSeekerProfileQuery,
  useCompleteJobSeekerProfileMutation,
  useUpdateJobSeekerProfileMutation,
} from "@/services/profileAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Page() {
  const { data, isLoading, isError, refetch } = useGetJobSeekerProfileQuery();
  const [completeProfile, { isLoading: isSubmitting }] = useCompleteJobSeekerProfileMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateJobSeekerProfileMutation();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [bio, setBio] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    if (data?.data?.jobseekers && !data.data.jobseekers.bio && !data.data.jobseekers.cv_path) {
      setOpen(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.data) {
      setFirstname(data.data.first_name || "");
      setLastname(data.data.last_name || "");
      setBio(data.data.jobseekers?.bio || "");
    }
  }, [data]);

  const handleSubmitComplete = async () => {
    if (!cv) return alert("Please upload your CV");
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("cv", cv);

    try {
      await completeProfile(formData).unwrap();
      setOpen(false);
      refetch();
    } catch (err: any) {
      alert(err?.data?.error || "Failed to complete profile");
    }
  };

  const handleSubmitUpdate = async () => {
    if (!data?.data?.user_id) return;
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    if (bio) formData.append("bio", bio);
    if (profilePicture) formData.append("profile_picture", profilePicture);
    if (cv) formData.append("cv", cv);

    try {
      await updateProfile({ id: data.data.user_id, formData }).unwrap();
      setEditOpen(false);
      refetch();
    } catch (err: any) {
      alert(err?.data?.error || "Failed to update profile");
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10">Something went wrong</p>;

  const user = data?.data;

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold text-center">My Profile</h1>

        {/* User Info Card */}
        <div className="bg-card dark:bg-card-dark p-6 rounded-xl shadow-md flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user?.profile_picture ? `${user.profile_picture}?t=${Date.now()}` : ""}
              alt={user?.first_name || "User"}
            />
            <AvatarFallback>{user?.first_name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <p className="text-xl font-semibold">{user?.first_name} {user?.last_name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-sm text-muted-foreground">Role: {user?.role}</p>
            <p className="text-sm text-muted-foreground">Verified: {user?.isVerified ? "Yes" : "No"}</p>
          </div>
        </div>

        {/* Bio + CV Card */}
        <div className="bg-card dark:bg-card-dark p-6 rounded-xl shadow-md space-y-3">
          <p><span className="font-semibold">Bio:</span> {user?.jobseekers?.bio || "Not Provided"}</p>
          <p>
            <span className="font-semibold">CV:</span>{" "}
            {user?.jobseekers?.cv_path
              ? <a
                  href={user.jobseekers.cv_path}
                  target="_blank"
                  className="text-primary underline"
                >
                  View CV
                </a>
              : "Not Uploaded"}
          </p>
          <Button variant="outline" onClick={() => setEditOpen(true)} className="mt-4 w-full">
            Edit Profile
          </Button>
        </div>

        {/* Complete Profile Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle>Complete Your Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Textarea
                placeholder="Write your bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCv(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSubmitComplete} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Input
                placeholder="First name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <Input
                placeholder="Last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              <Textarea
                placeholder="Update your bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Update Your Profile Picture</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Update Your CV/Resume</label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCv(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmitUpdate} disabled={isUpdating} className="w-full">
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useGetQuickJobProfileQuery,
  useCreateQuickJobProfileMutation,
} from "@/services/quickJobsAPI";
import { Loader2 } from "lucide-react";

export default function QuickJobProfilePage() {

  const { data, isLoading, isError, refetch } = useGetQuickJobProfileQuery({});

  const [createProfile, { isLoading: isCreating }] = useCreateQuickJobProfileMutation();

  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("");

  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading Quick Job profile…</span>
      </div>
    );
  }

  if (isError) {
    return <p className="p-6 text-red-500">Failed to load profile.</p>;
  }

  const exists = data?.exists;
  const profile = data?.profile;

  const handleCreate = async () => {
    const payload = { location: location.trim() || undefined };
    await createProfile(payload).unwrap();
    setOpen(false);
    refetch();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Quick Job – Profile</h1>

      {exists && profile ? (
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-4 space-y-2">
            <p><span className="font-semibold">User ID:</span> {profile.user_id}</p>
            <p><span className="font-semibold">Location:</span> {profile.location ?? "—"}</p>
            <p><span className="font-semibold">Rating:</span> {profile.rateing ?? "—"}</p>
            <p><span className="font-semibold">Total People Rated:</span> {profile.total_people_rated ?? 0}</p>
            {profile.users && (
              <p>
                <span className="font-semibold">Owner:</span>{" "}
                {profile.users.first_name} {profile.users.last_name} ({profile.users.email})
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-600">
              You don’t have a Quick Job profile yet. Create one to publish short-term jobs and get hired.
            </p>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Create Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Quick Job Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                  <label className="text-sm">Location (optional)</label>
                  <Input
                    placeholder="Addis Ababa, Bole …"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleCreate}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      "Create"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

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
import { Loader2, User, MapPin, Star, Users, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function QuickJobProfilePage() {
  const t = useTranslations("quickJobProfilePage");
  const { data, isLoading, isError, refetch } = useGetQuickJobProfileQuery({});
  const [createProfile, { isLoading: isCreating }] = useCreateQuickJobProfileMutation();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 dark:text-red-400 font-medium">{t("error")}</p>
          </CardContent>
        </Card>
      </div>
    );
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("pageTitle")}
          </h1>
        </div>

        {exists && profile ? (
          <Card className="shadow-lg rounded-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {profile.users?.first_name} {profile.users?.last_name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
                    <Mail className="h-4 w-4" />
                    {profile.users?.email}
                  </p>
                </div>

                {/* Profile Details */}
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("profile.userId")}:
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-mono">
                      {profile.user_id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-green-500 dark:text-green-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("profile.location")}:
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white">
                      {profile.location || t("profile.notProvided")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("profile.rating")}:
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white">
                      {profile.rateing || t("profile.notProvided")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("profile.totalRated")}:
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white">
                      {profile.total_people_rated || 0}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg rounded-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Profile Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {t("noProfile.message")}
              </p>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 px-6 py-3">
                    {t("noProfile.createButton")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl text-gray-900 dark:text-white">
                      {t("dialog.title")}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("dialog.locationLabel")}
                      </label>
                      <Input
                        placeholder={t("dialog.locationPlaceholder")}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={handleCreate}
                      disabled={isCreating}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("dialog.creating")}
                        </>
                      ) : (
                        t("dialog.create")
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
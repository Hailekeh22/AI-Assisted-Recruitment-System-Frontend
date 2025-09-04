"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  useFetchQuickJobApplicationsQuery,
  useHireQuickJobSeekerMutation,
  useUpdateQuickJobStatusMutation,
} from "@/services/quickJobsAPI";
import { Loader2, Star, Mail, MapPin, Calendar, User, Phone, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function ApplicationsPage() {
  const t = useTranslations("applicationsPage");
  const params = useParams();
  const jobId = Number(params.id);

  const { data, isLoading, isError } = useFetchQuickJobApplicationsQuery(jobId);
  const [hireSeeker, { isLoading: isHiring }] = useHireQuickJobSeekerMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateQuickJobStatusMutation();
  const [ratings, setRatings] = useState<Record<number, number | undefined>>({});

  const handleHire = async (assignmentId?: number) => {
    if (!assignmentId || !Number.isFinite(assignmentId)) {
      alert(t("messages.invalidAssignment"));
      return;
    }

    try {
      await hireSeeker(assignmentId).unwrap();
      alert(t("messages.hireSuccess"));
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to hire seeker.");
    }
  };

  const handleUpdateStatus = async (
    assignmentId?: number,
    status?: "completed" | "cancelled"
  ) => {
    if (!assignmentId || !Number.isFinite(assignmentId)) {
      alert(t("messages.invalidAssignment"));
      return;
    }
    if (!status) {
      alert(t("messages.invalidStatus"));
      return;
    }

    const ratingToSend = status === "completed" ? ratings[assignmentId] ?? undefined : undefined;

    try {
      await updateStatus({ assignmentId, status, rating: ratingToSend }).unwrap();
      alert(t("messages.updateSuccess"));
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to update assignment.");
    }
  };

  const handleRatingChange = (assignmentId: number, value: string) => {
    setRatings((prev) => ({
      ...prev,
      [assignmentId]: value === "" ? undefined : Number(value),
    }));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "accepted": return "default";
      case "completed": return "success";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

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
        <div className="p-6 text-center">
          <p className="text-red-500 dark:text-red-400 font-medium">{t("error")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("pageTitle")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage job applications and hiring process
          </p>
        </div>

        {data && data.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("tableHeaders.seekerName")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("tableHeaders.phoneNumber")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("tableHeaders.service")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("tableHeaders.location")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("tableHeaders.rating")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("tableHeaders.appliedAt")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("tableHeaders.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((app: any) => {
                    const aId = app.assignment_id;
                    const currentRating = ratings[aId];
                    const seeker = app.quickjobseekers;
                    const user = seeker?.users;

                    return (
                      <tr
                        key={aId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {/* Seeker Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {user?.first_name} {user?.last_name}
                            </span>
                          </div>
                        </td>

                        {/* Phone Number */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {seeker?.phone_number || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Service */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {seeker?.service || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {seeker?.location || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mr-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {seeker?.rateing ? `${seeker.rateing} ⭐` : "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Applied At */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(app.assigned_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {app.status !== "accepted" ? (
                            <Button
                              onClick={() => handleHire(aId)}
                              disabled={isHiring}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 h-8 text-xs"
                            >
                              {isHiring ? t("buttons.hiring") : t("buttons.hire")}
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-center">
                                <Badge variant="default" className="px-2 py-1 text-xs">
                                  {t("buttons.hired")}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                <Button
                                  onClick={() => handleUpdateStatus(aId, "cancelled")}
                                  disabled={isUpdating}
                                  variant="destructive"
                                  size="sm"
                                  className="h-8 text-xs"
                                >
                                  {isUpdating ? t("buttons.cancelling") : t("buttons.cancel")}
                                </Button>

                                <div className="flex gap-1">
                                  <select
                                    value={currentRating ?? ""}
                                    onChange={(e) => handleRatingChange(aId, e.target.value)}
                                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs h-8"
                                    aria-label={t("buttons.rate")}
                                  >
                                    <option value="">{t("buttons.rate")}</option>
                                    {[1, 2, 3, 4, 5].map((r) => (
                                      <option key={r} value={r}>
                                        {r} ⭐
                                      </option>
                                    ))}
                                  </select>
                                  <Button
                                    onClick={() => handleUpdateStatus(aId, "completed")}
                                    disabled={isUpdating || currentRating === undefined}
                                    size="sm"
                                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                  >
                                    {isUpdating ? t("buttons.completing") : t("buttons.complete")}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              {t("noApplications")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  useFetchQuickJobApplicationsQuery,
  useHireQuickJobSeekerMutation,
  useUpdateQuickJobStatusMutation,
} from "@/services/quickJobsAPI";
import { Loader2 } from "lucide-react";

export default function ApplicationsPage() {
  const params = useParams();
  const jobId = Number(params.id);

  // fetch applications for this job
  const { data, isLoading, isError } =
    useFetchQuickJobApplicationsQuery(jobId);

  const [hireSeeker, { isLoading: isHiring }] = useHireQuickJobSeekerMutation();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateQuickJobStatusMutation();

  // keep rating per assignment id
  const [ratings, setRatings] = useState<Record<number, number | undefined>>({});

  const handleHire = async (assignmentId?: number) => {
    if (!assignmentId || !Number.isFinite(assignmentId)) {
      console.error("handleHire: invalid assignmentId", assignmentId);
      alert("Invalid assignment id");
      return;
    }

    try {
      console.log("Hiring assignmentId:", assignmentId);
      await hireSeeker(assignmentId).unwrap();
      alert("Seeker hired successfully!");
    } catch (err: any) {
      console.error("hire error:", err);
      alert(err?.data?.error || err?.message || "Failed to hire seeker.");
    }
  };

  const handleUpdateStatus = async (
    assignmentId?: number,
    status?: "completed" | "cancelled"
  ) => {
    if (!assignmentId || !Number.isFinite(assignmentId)) {
      console.error("handleUpdateStatus: invalid assignmentId", assignmentId);
      alert("Invalid assignment id");
      return;
    }
    if (!status) {
      alert("Invalid status");
      return;
    }

    // pick rating only for completed; convert undefined if not set
    const ratingToSend =
      status === "completed" ? ratings[assignmentId] ?? undefined : undefined;

    try {
      console.log("Updating assignment:", { assignmentId, status, ratingToSend });
      await updateStatus({ assignmentId, status, rating: ratingToSend }).unwrap();
      alert(`Assignment ${status} successfully!`);
    } catch (err: any) {
      console.error("update status error:", err);
      alert(err?.data?.error || err?.message || "Failed to update assignment.");
    }
  };

  const handleRatingChange = (assignmentId: number, value: string) => {
    // convert empty string to undefined, otherwise number
    setRatings((prev) => ({
      ...prev,
      [assignmentId]: value === "" ? undefined : Number(value),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load applications.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      {data && data.length > 0 ? (
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 border">Seeker Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Applied At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((app: any) => {
              const aId = app.assignment_id;
              const currentRating = ratings[aId];

              return (
                <tr
                  key={aId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-2 border">
                    {app.quickjobseekers?.users?.first_name}{" "}
                    {app.quickjobseekers?.users?.last_name}
                  </td>
                  <td className="p-2 border">
                    {app.quickjobseekers?.users?.email}
                  </td>
                  <td className="p-2 border">
                    {app.quickjobseekers?.location}
                  </td>
                  <td className="p-2 border">
                    {app.quickjobseekers?.rateing ?? "N/A"} ⭐
                  </td>
                  <td className="p-2 border capitalize">{app.status}</td>
                  <td className="p-2 border">
                    {new Date(app.assigned_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center space-y-2">
                    {app.status !== "accepted" ? (
                      <button
                        onClick={() => handleHire(aId)}
                        disabled={isHiring}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {isHiring ? "Hiring..." : "Hire"}
                      </button>
                    ) : (
                      <>
                        <span className="text-green-600 font-bold block">Hired</span>

                        {/* Cancel */}
                        <button
                          onClick={() => handleUpdateStatus(aId, "cancelled")}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 mt-2"
                        >
                          {isUpdating ? "Updating..." : "Cancel"}
                        </button>

                        {/* Rating + Complete */}
                        <div className="flex items-center gap-2 mt-2 justify-center">
                          <select
                            value={currentRating ?? ""}
                            onChange={(e) => handleRatingChange(aId, e.target.value)}
                            className="border rounded px-2 py-1"
                            aria-label={`Rate seeker ${aId}`}
                          >
                            <option value="">Rate</option>
                            {[1, 2, 3, 4, 5].map((r) => (
                              <option key={r} value={r}>
                                {r} ⭐
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateStatus(aId, "completed")}
                            disabled={isUpdating || currentRating === undefined}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isUpdating ? "Updating..." : "Complete"}
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No applications yet for this job.</p>
      )}
    </div>
  );
}

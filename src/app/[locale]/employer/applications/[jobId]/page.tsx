"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetApplicationsByJobQuery,
  useUpdateApplicationStatusMutation,
  useScheduleInterviewMutation,
} from "@/services/applicationAPI";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ApplicationsPage = () => {
  const { jobId } = useParams();
  const { data, isLoading, error } = useGetApplicationsByJobQuery(Number(jobId));
  const [updateStatus] = useUpdateApplicationStatusMutation();
  const [scheduleInterview] = useScheduleInterviewMutation();

  // State for dialog
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [location, setLocation] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);

  if (isLoading) return <p className="p-6">Loading applications...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load applications</p>;

  const getScoreStyle = (score: number) => {
    if (score >= 80) return "text-green-600 text-xl font-bold";
    if (score >= 60) return "text-yellow-500 text-xl font-bold";
    return "text-red-600 text-xl font-bold";
  };

  const statuses = ["pending", "waitlisted", "accepted", "rejected"];

  const handleSchedule = async () => {
    if (!selectedApp || !selectedDate) return;
    await scheduleInterview({
      applicationId: selectedApp.application_id,
      seekerId: selectedApp.jobseekers.users.user_id,
      scheduledTime: selectedDate.toISOString(),
      location,
    });
    setSelectedApp(null);
    setLocation("");
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Applications for Job #{jobId}</h2>

      {data?.data?.length > 0 ? (
        data.data.map((app: any) => (
          <Card key={app.application_id} className="shadow-lg rounded-2xl border border-gray-200 dark:border-black">
            <CardContent className="p-6 space-y-3">
              <p>
                <span className="font-semibold">Applicant ID:</span> {app.jobseekers.users.user_id}
              </p>
              <p>
                <span className="font-semibold">Applicant:</span> {app.jobseekers.users.first_name}
              </p>
              <p>
                <span className="font-semibold">Cover Letter:</span> {app.cover_letter || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Applied At:</span> {new Date(app.applied_at).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">CV:</span>{" "}
                {app.jobseekers.cv_path ? (
                  <a href={app.cv_path} target="_blank" className="text-blue-600 underline hover:text-blue-800">
                    View CV
                  </a>
                ) : (
                  "Not uploaded"
                )}
              </p>

              {/* STATUS SELECT */}
              <div className="mt-2">
                <label className="font-semibold mr-2">Status:</label>
                <select
                  value={app.status}
                  onChange={(e) =>
                    updateStatus({
                      applicationId: app.application_id,
                      status: e.target.value,
                    })
                  }
                  className="border rounded-md p-2 bg-white dark:bg-gray-900"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* INTERVIEW SCHEDULER */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setSelectedApp(app);
                      setSelectedDate(new Date());
                      setLocation("");
                    }}
                  >
                    Schedule Interview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="font-semibold">Choose Date:</p>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />

                    <div>
                      <label className="font-semibold">Location:</label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter interview location"
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSchedule}>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* AI Analysis */}
              {app.analysisresults?.length > 0 && (
                <div className="mt-4 bg-gray-50 dark:bg-green-950 p-4 rounded-xl border border-gray-200 dark:border-black">
                  <p className="font-semibold text-lg mb-2">AI Analysis Results:</p>
                  {app.analysisresults.map((ar: any, idx: number) => (
                    <div key={idx} className="ml-2 p-3 rounded-lg bg-white dark:bg-[#0a0a0a] shadow-sm border ">
                      <p className={getScoreStyle(Number(ar.score))}>Suitability Score: {ar.score}%</p>
                      <p className="text-gray-700 dark:text-white mt-1 leading-relaxed">{ar.highlights}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No applications yet.</p>
      )}
    </div>
  );
};

export default ApplicationsPage;

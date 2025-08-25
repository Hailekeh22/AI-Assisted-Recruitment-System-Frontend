"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGetEmployerInterviewsQuery } from "@/services/applicationAPI";

const InterviewsPage = () => {
  const { data, isLoading, error } = useGetEmployerInterviewsQuery({});

  if (isLoading) return <p className="p-6">Loading interviews...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load interviews</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Scheduled Interviews</h2>

      {data?.data?.length > 0 ? (
        data.data.map((interview: any) => (
          <Card
            key={interview.interview_id}
            className="shadow-lg rounded-2xl border border-gray-200 dark:border-black"
          >
            <CardContent className="p-6 space-y-3">
              <p>
                <span className="font-semibold">Applicant:</span>{" "}
                {interview.applications.jobseekers.users.first_name}
              </p>
              <p>
                <span className="font-semibold">Applicant ID:</span>{" "}
                {interview.applications.jobseekers.users.user_id}
              </p>
              <p>
                <span className="font-semibold">Job Title:</span>{" "}
                {interview.applications.jobs.title}
              </p>
              <p>
                <span className="font-semibold">Scheduled Time:</span>{" "}
                {new Date(interview.scheduled_time).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {interview.location || "did not specified"}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No interviews scheduled yet.</p>
      )}
    </div>
  );
};

export default InterviewsPage;

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGetJobSeekerInterviewsQuery } from "@/services/applicationAPI";
import { Loader2 } from "lucide-react";

function page() {
  const { data, isLoading, isError } = useGetJobSeekerInterviewsQuery({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading interviews...</span>
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500 text-center mt-6">Failed to load interviews.</p>;
  }

  const interviews = data?.interviews || [];

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">My Interviews</h1>

      {interviews.length === 0 ? (
        <p className="text-gray-500">No interviews scheduled.</p>
      ) : (
        interviews.map((interview:any, index:number) => (
          <Card key={index} className="shadow-md">
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg">{interview.applications.jobs.title}</h2>
              <p>Status: {interview.applications.status}</p>
              <p>Date: {new Date(interview.scheduled_time).toLocaleDateString()}</p>
              <p>Location: {interview.location}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default page;

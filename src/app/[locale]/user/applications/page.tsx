"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetApplicationsQuery } from "@/services/applicationAPI";

interface applications {
  job_title: string;
  status: string;
  applied_at: string;
  salary: string;
}

export default function ApplicationsPage() {
  const { data, isError } = useGetApplicationsQuery({});

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load applications.
      </div>
    );
  }

    if (!data?.applications || data.applications.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600 font-medium">
        No applications found.
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.applications?.map((app:applications, index:number) => (
        <Card key={index} className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {app.job_title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-md text-sm ${
                  app.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : app.status === "accepted"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {app.status}
              </span>
            </p>
            <p>
              <span className="font-medium">Applied At:</span>{" "}
              {new Date(app.applied_at).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Salary:</span> {app.salary}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  useJobSeekerGetAllJObsQuery,
  useApplyToJobMutation,
} from "@/services/jobsAPI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export default function JobsListing() {
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const { data, isError } = useJobSeekerGetAllJObsQuery(page);
  const [applyToJob, { isLoading: applying }] = useApplyToJobMutation();

  if (isError) return <p>Failed to load jobs.</p>;

  const jobs = data?.data || [];

  const truncateDescription = (desc: string, wordLimit = 20) => {
    const words = desc.split(" ");
    if (words.length <= wordLimit) return desc;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleCardClick = (job: any) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleApplicationSubmit = async () => {
    if (!selectedJob) return;
    try {
      await applyToJob({
        job_id: selectedJob.job_id,
        cover_letter: coverLetter,
      }).unwrap();
      alert("Application submitted successfully!");
      setSheetOpen(false);
      setCoverLetter("");
    } catch (err) {
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Job Listings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card
            key={job.job_id}
            className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleCardClick(job)}
          >
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <Badge variant="secondary" className="capitalize">
                {job.job_type.replace("_", " ")}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">
                {truncateDescription(job.description)}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Category:</span> {job.category}
              </p>
              <p className="mt-1">
                <span className="font-semibold">Salary:</span> {job.salary}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-semibold">Deadline:</span>{" "}
                {new Date(job.application_deadline).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!data.pagination.hasPrevPage}
          >
            Previous
          </Button>
          <span className="self-center">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data.pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}

      {/* Job Details Dialog */}
      {selectedJob && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className=" min-w-[50vh] h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedJob.title}
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-4">
              <div className=" mt-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-sm">
                    {selectedJob.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                  <p className="text-sm">
                    {selectedJob.requirements}
                  </p>
                </div>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {selectedJob.category}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span>{" "}
                    {selectedJob.job_type.replace("_", " ")}
                  </p>
                  <p>
                    <span className="font-semibold">Salary:</span>{" "}
                    {selectedJob.salary}
                  </p>
                  <p>
                    <span className="font-semibold">Deadline:</span>{" "}
                    {new Date(
                      selectedJob.application_deadline
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {selectedJob.status}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button className="w-full" onClick={() => setSheetOpen(true)}>
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Apply Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>Apply for {selectedJob?.title}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Textarea
              placeholder="Write your cover letter..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <SheetFooter className="mt-4">
            <Button
              className="w-full"
              onClick={handleApplicationSubmit}
              disabled={applying}
            >
              {applying ? "Submitting..." : "Submit Application"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

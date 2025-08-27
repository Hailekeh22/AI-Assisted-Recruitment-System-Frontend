"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useGetEmployerInterviewsQuery, useSendMessageMutation } from "@/services/applicationAPI";
import { toast } from "sonner";

const InterviewsPage = () => {
  const { data, isLoading, error } = useGetEmployerInterviewsQuery({});
  const [sendMessage] = useSendMessageMutation();
  const [message, setMessage] = useState("");
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  if (isLoading) return <p className="p-6">Loading interviews...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load interviews</p>;

  const handleSend = async (seekerId: string) => {
    if (!message.trim()) return;
    const sendmessage = await sendMessage({ seekerId, message }).unwrap();
    setMessage("");
    toast.success(sendmessage.message);
    setOpenDialogId(null);
  };

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

              {/* Send Message Dialog */}
              <Dialog
                open={openDialogId === interview.interview_id}
                onOpenChange={(isOpen) =>
                  setOpenDialogId(isOpen ? interview.interview_id : null)
                }
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Send Message</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Message to {interview.applications.jobseekers.users.first_name}
                    </DialogTitle>
                  </DialogHeader>
                  <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <DialogFooter>
                    <Button onClick={() => handleSend(interview.applications.jobseekers.user_id)}>
                      Send
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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

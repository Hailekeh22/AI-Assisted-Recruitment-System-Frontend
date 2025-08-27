"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  useGetJobSeekerInterviewsQuery,
  useSendMessageToEmployerMutation,
} from "@/services/applicationAPI";
import { Loader2 } from "lucide-react";
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
import { toast } from "sonner";

function Page() {
  const { data, isLoading, isError } = useGetJobSeekerInterviewsQuery({});
  const [sendMessage] = useSendMessageToEmployerMutation();

  const [message, setMessage] = useState("");
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading interviews...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center mt-6">
        Failed to load interviews.
      </p>
    );
  }

  const interviews = data?.interviews || [];

  const handleSend = async (employerId: string) => {
    if (!message.trim()) return;
    try {
      const sendmessage = await sendMessage({ employerId, message }).unwrap();
      toast.success(sendmessage.message);
      setMessage("");
      setOpenDialogId(null);
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
      return;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">My Interviews</h1>

      {interviews.length === 0 ? (
        <p className="text-gray-500">No interviews scheduled.</p>
      ) : (
        interviews.map((interview: any) => (
          <Card key={interview.interview_id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">
                {interview.applications.jobs.title}
              </h2>
              <p>Status: {interview.applications.status}</p>
              <p>
                Date: {new Date(interview.scheduled_time).toLocaleDateString()}
              </p>
              <p>Location: {interview.location || "Not specified"}</p>

              {/* Send message dialog */}
              <Dialog
                open={openDialogId === interview.interview_id}
                onOpenChange={(isOpen) =>
                  setOpenDialogId(isOpen ? interview.interview_id : null)
                }
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Send Message to Employer</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Message to Employer of {interview.applications.jobs.title}
                    </DialogTitle>
                  </DialogHeader>
                  <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <DialogFooter>
                    <Button
                      onClick={() =>
                        handleSend(interview.applications.jobs.employer_id)
                      }
                    >
                      Send
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default Page;

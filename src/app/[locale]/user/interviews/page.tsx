"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  useGetJobSeekerInterviewsQuery,
  useSendMessageToEmployerMutation,
  useGetInterviewPreparationMutation,
} from "@/services/applicationAPI";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

function Page() {
  const t = useTranslations("interviewsPage");
  const { data, isLoading, isError } = useGetJobSeekerInterviewsQuery({});
  const [sendMessage] = useSendMessageToEmployerMutation();
  const [getPrep, { isLoading: prepLoading }] =
    useGetInterviewPreparationMutation();

  const [message, setMessage] = useState("");
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [prepDialogOpen, setPrepDialogOpen] = useState(false);
  const [prepTips, setPrepTips] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">{t("loading")}</span>
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500 text-center mt-6">{t("error")}</p>;
  }

  const interviews = data?.interviews || [];

  const handleSend = async (employerId: string) => {
    if (!message.trim()) return;
    try {
      await sendMessage({ employerId, message }).unwrap();
      toast.success(t("messages.sendSuccess"));
      setMessage("");
      setOpenDialogId(null);
    } catch (err) {
      toast.error(t("messages.sendError"));
    }
  };

  const handleGetPrep = async (jobId: number) => {
    try {
      const res = await getPrep({ jobId }).unwrap();
      setPrepTips(res.tips);
      setPrepDialogOpen(true);
    } catch {
      toast.error("Failed to fetch interview preparation tips");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">{t("pageTitle")}</h1>

      {interviews.length === 0 ? (
        <p className="text-gray-500">{t("noInterviews")}</p>
      ) : (
        interviews.map((interview: any) => (
          <Card key={interview.interview_id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">
                {interview.applications.jobs.title}
              </h2>
              <p>
                {t("interviewCard.status")}: {interview.applications.status}
              </p>
              <p>
                {t("interviewCard.date")}:{" "}
                {new Date(interview.scheduled_time).toLocaleDateString()}
              </p>
              <p>
                {t("interviewCard.location")}:{" "}
                {interview.location || t("interviewCard.locationNotSpecified")}
              </p>

              {/* Send message dialog */}
              <Dialog
                open={openDialogId === interview.interview_id}
                onOpenChange={(open) => {
                  if (!open) {
                    setOpenDialogId(null);
                  } else {
                    setOpenDialogId(interview.interview_id);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    {t("dialog.sendMessage")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {t("dialog.title", {
                        jobTitle: interview.applications.jobs.title,
                      })}
                    </DialogTitle>
                  </DialogHeader>
                  <Textarea
                    placeholder={t("dialog.placeholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={() =>
                      handleSend(interview.applications.jobs.employer_id)
                    }
                  >
                    {t("dialog.send")}
                  </Button>
                </DialogContent>
              </Dialog>

              {/* Get Interview Preparation */}
              <Button
                variant="default"
                onClick={() =>
                  handleGetPrep(interview.applications.jobs.job_id)
                }
                disabled={prepLoading}
                className="ml-2"
              >
                {prepLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Get Interview Preparation"
                )}
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      {/* Interview Preparation Dialog */}
      <Dialog open={prepDialogOpen} onOpenChange={setPrepDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Interview Preparation Tips</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap overflow-y-auto pr-2 flex-1">
            {prepTips}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page;
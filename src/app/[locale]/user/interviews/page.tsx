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
import { useTranslations } from "next-intl";

function Page() {
  const t = useTranslations("interviewsPage");
  const { data, isLoading, isError } = useGetJobSeekerInterviewsQuery({});
  const [sendMessage] = useSendMessageToEmployerMutation();

  const [message, setMessage] = useState("");
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">{t("loading")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center mt-6">
        {t("error")}
      </p>
    );
  }

  const interviews = data?.interviews || [];

  const handleSend = async (employerId: string) => {
    if (!message.trim()) return;
    try {
      const sendmessage = await sendMessage({ employerId, message }).unwrap();
      toast.success(t("messages.sendSuccess"));
      setMessage("");
      setOpenDialogId(null);
    } catch (err) {
      toast.error(t("messages.sendError"));
      return;
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
              <p>{t("interviewCard.status")}: {interview.applications.status}</p>
              <p>
                {t("interviewCard.date")}: {new Date(interview.scheduled_time).toLocaleDateString()}
              </p>
              <p>{t("interviewCard.location")}: {interview.location || t("interviewCard.locationNotSpecified")}</p>

              {/* Send message dialog */}
              <Dialog
                open={openDialogId === interview.interview_id}
                onOpenChange={(isOpen) =>
                  setOpenDialogId(isOpen ? interview.interview_id : null)
                }
              >
                <DialogTrigger asChild>
                  <Button variant="outline">{t("dialog.sendMessage")}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {t("dialog.title", { jobTitle: interview.applications.jobs.title })}
                    </DialogTitle>
                  </DialogHeader>
                  <Textarea
                    placeholder={t("dialog.placeholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <DialogFooter>
                    <Button
                      onClick={() =>
                        handleSend(interview.applications.jobs.employer_id)
                      }
                    >
                      {t("dialog.send")}
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
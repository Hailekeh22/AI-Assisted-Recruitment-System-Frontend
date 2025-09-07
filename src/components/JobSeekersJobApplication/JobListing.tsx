"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  useJobSeekerGetAllJObsQuery,
  useApplyToJobMutation,
  useGetAiJobSummaryQuery,
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
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JobsListing() {
  const t = useTranslations("jobsListingPage");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [summaryJob, setSummaryJob] = useState<any | null>(null);

  const { data, isError, isLoading, refetch } = useJobSeekerGetAllJObsQuery({
    page,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const [applyToJob, { isLoading: applying }] = useApplyToJobMutation();

  const { data: summaryData, isFetching: fetchingSummary } =
    useGetAiJobSummaryQuery(summaryJob?.job_id, {
      skip: !summaryJob,
    });

  useEffect(() => {
    refetch();
  }, [selectedCategory, page, refetch]);

  if (isError) return <p>{t("error")}</p>;

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
      toast(t("messages.applySuccess"));
      setSheetOpen(false);
      setCoverLetter("");
    } catch (err) {
      const errorMessage =
        (err as any)?.data?.message ||
        (err as any)?.error ||
        (err as any)?.message ||
        t("messages.applyError");

      toast(errorMessage);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">{t("pageTitle")}</h1>

      {/* Category Dropdown */}
      <div className="mb-6 w-64">
        <Select
          value={selectedCategory}
          onValueChange={(val) => {
            setSelectedCategory(val);
            setPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("filters.categoryPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.allCategories")}</SelectItem>
            <SelectItem value="Sales">{t("filters.Sales")}</SelectItem>
            <SelectItem value="Technology">{t("filters.Technology")}</SelectItem>
            <SelectItem value="Engineering">{t("filters.Engineering")}</SelectItem>
            <SelectItem value="Health">{t("filters.Health")}</SelectItem>
            <SelectItem value="Marketing">{t("filters.Marketing")}</SelectItem>
            <SelectItem value="Education">{t("filters.Education")}</SelectItem>
            <SelectItem value="Finance">{t("filters.Finance")}</SelectItem>
            <SelectItem value="Hospitality">{t("filters.Hospitality")}</SelectItem>
            <SelectItem value="Legal">{t("filters.Legal")}</SelectItem>
            <SelectItem value="Design">{t("filters.Design")}</SelectItem>
            <SelectItem value="Agriculture">{t("filters.Agriculture")}</SelectItem>
            <SelectItem value="others">{t("filters.others")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Jobs Grid */}
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
                <span className="font-semibold">{t("jobCard.category")}:</span>{" "}
                {job.category}
              </p>
              <p className="mt-1">
                <span className="font-semibold">{t("jobCard.salary")}:</span>{" "}
                {job.salary}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-semibold">{t("jobCard.deadline")}:</span>{" "}
                {new Date(job.application_deadline).toLocaleDateString()}
              </p>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setSummaryJob(job);
                }}
                className="w-full mt-2"
              >
                {t("jobCard.aiSummary")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">{t("noJobs")}</p>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && jobs.length > 0 && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!data.pagination.hasPrevPage || isLoading}
          >
            {t("buttons.previous")}
          </Button>
          <span className="self-center">
            {t("pagination.page")} {data.pagination.page} {t("pagination.of")}{" "}
            {data.pagination.totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data.pagination.hasNextPage || isLoading}
          >
            {t("buttons.next")}
          </Button>
        </div>
      )}

      {/* Job Details Dialog */}
      {selectedJob && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="min-w-[50vh] h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedJob.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-4">
              <div className="mt-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {t("jobDetails.description")}
                  </h3>
                  <p className="text-sm">{selectedJob.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {t("jobDetails.requirements")}
                  </h3>
                  <p className="text-sm">{selectedJob.requirements}</p>
                </div>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">{t("jobCard.category")}:</span>{" "}
                    {selectedJob.category}
                  </p>
                  <p>
                    <span className="font-semibold">{t("jobDetails.type")}:</span>{" "}
                    {selectedJob.job_type.replace("_", " ")}
                  </p>
                  <p>
                    <span className="font-semibold">{t("jobCard.salary")}:</span>{" "}
                    {selectedJob.salary}
                  </p>
                  <p>
                    <span className="font-semibold">{t("jobCard.deadline")}:</span>{" "}
                    {new Date(selectedJob.application_deadline).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">{t("jobDetails.status")}:</span>{" "}
                    {selectedJob.status}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2 mt-4">
              <Button className="w-full" onClick={() => setSheetOpen(true)}>
                {t("buttons.apply")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* AI Summary Dialog */}
      <Dialog
        open={!!summaryJob}
        onOpenChange={(open) => !open && setSummaryJob(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("aiSummary.title", { jobTitle: summaryJob?.title || "" })}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {fetchingSummary ? (
              <p>{t("aiSummary.generating")}</p>
            ) : summaryData ? (
              <p className="text-sm whitespace-pre-line">
                {summaryData.summary}
              </p>
            ) : (
              <p>{t("aiSummary.noSummary")}</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setSummaryJob(null)}>
              {t("buttons.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[500px] px-4 sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>
              {t("applySheet.title", { jobTitle: selectedJob?.title || "" })}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Textarea
              placeholder={t("applySheet.placeholder")}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[350px] resize-none"
            />
          </div>
          <SheetFooter className="mt-4">
            <Button
              className="w-full"
              onClick={handleApplicationSubmit}
              disabled={applying}
            >
              {applying ? t("buttons.submitting") : t("buttons.submit")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
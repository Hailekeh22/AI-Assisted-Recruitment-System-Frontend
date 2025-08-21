"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useGetAllJobsQuery, useAdmindeleteJobMutation } from "@/services/jobsAPI";
import type { Job } from "@/services/jobsAPI";

// Pagination type based on your API response
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetAllJobsResponse {
  data: Job[];
  pagination: Pagination;
}

const JobsTable: React.FC = () => {
  const t = useTranslations("jobs");

  // Pagination state
  const [page, setPage] = useState(1);

  // RTK Query hooks
  const { data: responseData, refetch, isLoading } = useGetAllJobsQuery(page);
  const [deleteJob, { isLoading: isDeleting }] = useAdmindeleteJobMutation();

  // State for full content dialog
  const [selectedField, setSelectedField] = useState<{
    title: string;
    content: string;
  } | null>(null);

  // State for delete confirmation
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);

  // Helper to truncate text
  const truncate = (text: string, max = 40) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  // Delete handlers
  const handleDelete = (id: number) => setDeletingJobId(id);
  const confirmDelete = async () => {
    if (deletingJobId === null) return;
    try {
      await deleteJob(deletingJobId).unwrap();
      toast.success("Job deleted successfully");
      setDeletingJobId(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  // Extract jobs and pagination
  const jobs = responseData?.data || [];
  const pagination = responseData?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.page || 1;

  return (
    <div className="w-full bg-blue-500/10 dark:bg-[#252525] rounded-2xl shadow-lg p-6 transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {t("allJobs")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-blue-600 dark:bg-gray-700 text-gray-200">
              <th className="p-3">{t("title")}</th>
              <th className="p-3">{t("description")}</th>
              <th className="p-3">{t("requirements")}</th>
              <th className="p-3">{t("salary")}</th>
              <th className="p-3">{t("employer")}</th>
              <th className="p-3">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-black dark:text-gray-400"
                >
                  {t("loadingjobs")}
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-black dark:text-gray-400"
                >
                  {t("nojob")}
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job.job_id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td
                    className="p-3 text-black dark:text-gray-100 cursor-pointer hover:underline"
                    onClick={() =>
                      setSelectedField({ title: "Job Title", content: job.title })
                    }
                  >
                    {truncate(job.title)}
                  </td>
                  <td
                    className="p-3 text-black dark:text-gray-100 cursor-pointer hover:underline"
                    onClick={() =>
                      setSelectedField({
                        title: "Description",
                        content: job.description,
                      })
                    }
                  >
                    {truncate(job.description)}
                  </td>
                  <td
                    className="p-3 text-black dark:text-gray-100 cursor-pointer hover:underline"
                    onClick={() =>
                      setSelectedField({
                        title: "Requirements",
                        content: job.requirements,
                      })
                    }
                  >
                    {truncate(job.requirements)}
                  </td>
                  <td
                    className="p-3 text-black dark:text-gray-100 cursor-pointer hover:underline"
                    onClick={() =>
                      setSelectedField({
                        title: "Salary",
                        content: job.salary,
                      })
                    }
                  >
                    {truncate(job.salary)}
                  </td>
                  <td
                    className="p-3 text-black dark:text-gray-100 cursor-pointer hover:underline"
                    onClick={() =>
                      setSelectedField({
                        title: "Employer ID",
                        content: job.employer_id,
                      })
                    }
                  >
                    {truncate(job.employer_id)}
                  </td>
                  <td className="p-3 text-red-600 cursor-pointer">
                    <Trash2
                      className="w-5 h-5 hover:text-red-800"
                      onClick={() => handleDelete(job.job_id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {responseData && (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage <= 1}
            className={`px-3 py-1 rounded ${
              currentPage <= 1
                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            }`}
          >
            {t("prevbtn")}
          </Button>

          <span className="text-gray-800 dark:text-gray-300">
            {t("page")} {currentPage} {t("of")} {totalPages}
          </span>

          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={currentPage >= totalPages}
            className={`px-3 py-1 rounded ${
              currentPage >= totalPages
                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            }`}
          >
            {t("nextbtn")}
          </Button>
        </div>
      )}

      {/* Full content dialog */}
      <Dialog open={!!selectedField} onOpenChange={() => setSelectedField(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedField?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {selectedField?.content}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deletingJobId}
        onOpenChange={(open) => !open && setDeletingJobId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmdelete")}</DialogTitle>
            <DialogDescription>
                {t("deletetxt")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeletingJobId(null)}
              disabled={isDeleting}
            >
              {t("cancelbtn")}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobsTable;

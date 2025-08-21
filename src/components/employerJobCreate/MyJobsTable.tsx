"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useGetMyJobsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@/services/jobsAPI";
import { useTranslations } from "next-intl";
import { Trash } from "lucide-react";

interface Job {
  job_id: number;
  employer_id: string;
  title: string;
  description: string;
  job_type: string;
  requirements: string;
  salary: string;
  application_deadline: string;
  status: string;
  created_at: string;
}

const truncate = (text: string, limit = 40) =>
  text.length > limit ? text.slice(0, limit) + "..." : text;

const MyJobsTable: React.FC = () => {
  const t = useTranslations("jobpost");
  const { data, refetch } = useGetMyJobsQuery();
  const [updateJob] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formState, setFormState] = useState<Partial<Job>>({});
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null); // State to manage delete confirmation

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormState(job);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const payload = {
      ...formState,
      application_deadline: formState.application_deadline
        ? new Date(formState.application_deadline)
        : undefined,
    };

    const result = await updateJob({
      id: editingJob.job_id,
      body: payload,
    }).unwrap();

    if (result?.message) {
      toast.success(result.message);
      setEditingJob(null);
      refetch();
    }
  };

  const handleDelete = (jobId: number) => {
    setDeletingJobId(jobId);
  };

  const confirmDelete = async () => {
    if (deletingJobId === null) return;
    const result = await deleteJob(deletingJobId).unwrap();
    if (result?.message) {
      toast.success(result.message);
      setDeletingJobId(null);
      refetch();
    }
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-neutral-900 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        {t("myjobposts")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-neutral-800 text-left">
              <th className="p-3">{t("tabletitle")}</th>
              <th className="p-3">{t("tabledescription")}</th>
              <th className="p-3">{t("tablesalary")}</th>
              <th className="p-3">{t("tableactions")}</th>
            </tr>
          </thead>
         <tbody>
  {data?.myJobs && data.myJobs.length > 0 ? (
    data.myJobs.map((job) => (
      <tr
        key={job.job_id}
        className="border-b border-gray-200 dark:border-neutral-700"
      >
        <td className="p-3 font-medium">{job.title}</td>

        {/* description with dialog */}
        <td className="p-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="p-0 h-auto">
                {truncate(job.description, 60)}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("jobdescription")}</DialogTitle>
              </DialogHeader>
              <p className="text-sm">{job.description}</p>
            </DialogContent>
          </Dialog>
        </td>

        <td className="p-3">{job.salary}</td>

        <td className="p-3 flex space-x-2 items-center">
          <Button
            size="sm"
            onClick={() => handleEdit(job)}
            className="bg-blue-600 text-white"
          >
            {t("editbtn")}
          </Button>
          <Button
            size="sm"
            onClick={() => handleDelete(job.job_id)}
            className="bg-red-600 text-white"
          >
            <Trash />
          </Button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={4}
        className="p-3 text-center text-gray-500 dark:text-gray-400"
      >
        {t("nojobsposted")}
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>

      {/* Edit Job Dialog - Updated with a better grid layout */}
      <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("editjob")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* First row: Short inputs using a responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  {t("edittitle")}
                </span>
                <input
                  name="title"
                  value={formState.title || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded"
                  placeholder={t("edittitleplaceholder")}
                />
              </label>
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  {t("editsalary")}
                </span>
                <input
                  name="salary"
                  value={formState.salary || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded"
                  placeholder={t("editsalaryplaceholder")}
                />
              </label>
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  {t("editjobtype")}
                </span>
                <select
                  name="job_type"
                  value={formState.job_type || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-white dark:bg-black text-black dark:text-white p-2 border rounded"
                >
                  <option value="">{t("selectjobtype")}</option>
                  <option value="on_site">{t("onsite")}</option>
                  <option value="remote">{t("remote")}</option>
                  <option value="hybrid">{t("hybrid")}</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  {t("editdeadline")}
                </span>
                <input
                  type="date"
                  name="application_deadline"
                  value={
                    formState.application_deadline
                      ? new Date(formState.application_deadline)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  {t("editstatus")}
                </span>
                <input
                  name="status"
                  value={formState.status || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded"
                  placeholder={t("editstatusplaceholder")}
                />
              </label>
            </div>

            {/* Second row: Description */}
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                {t("editdescription")}
              </span>
              <textarea
                name="description"
                value={formState.description || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
                placeholder={t("editdescriptionplaceholder")}
                rows={4}
              />
            </label>

            {/* Third row: Requirements */}
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                {t("editreq")}
              </span>
              <textarea
                name="requirements"
                value={formState.requirements || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
                placeholder={t("editreqplaceholder")}
                rows={4}
              />
            </label>

            <Button type="submit" className="bg-green-600 text-white mt-4">
              {t("saveeditbtn")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingJobId}
        onOpenChange={() => setDeletingJobId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deletedialogtitle")}</DialogTitle>
            <DialogDescription>{t("deleteconfirmation")}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDeletingJobId(null)}>
              {t("canceldeletebtn")}
            </Button>
            <Button className="bg-red-600 text-white" onClick={confirmDelete}>
              {t("confirmdeletebtn")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyJobsTable;

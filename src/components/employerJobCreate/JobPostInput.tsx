"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { usePostJobMutation, useGetMyJobsQuery } from "@/services/jobsAPI";

const JobPostInput: React.FC = () => {
  const t = useTranslations("jobpost");

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");

  const [submitJob, { isLoading }] = usePostJobMutation();
  const { refetch } = useGetMyJobsQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !jobType || !deadline) {
      toast(t("missingfields")); // "Missing required fields"
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("job_type", jobType);
    formData.append("requirements", requirements);
    if (salary) formData.append("salary", salary);
    formData.append("application_deadline", deadline);

    try {
      const result = await submitJob(formData).unwrap();
      toast(result?.message);

      refetch();
      setTitle("");
      setDescription("");
      setJobType("");
      setRequirements("");
      setSalary("");
      setDeadline("");
    } catch (err) {
      toast(t("error")); // "Error while posting job"
    }
  };

  return (
    <div className="w-full flex justify-center transition-colors">
      <div className="w-full max-w-4xl bg-blue-500/10 dark:bg-[#141414] rounded-2xl shadow p-8 border transition-colors">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Job Title */}
          <div>
            <label
              htmlFor="job-title"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("jobtitle")}
            </label>
            <input
              id="job-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("jobtitleplaceholder")}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("description")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionplaceholder")}
              rows={8}
              className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
            />
          </div>

          {/* Job Type */}
          <div>
            <label
              htmlFor="job-type"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("jobtype")}
            </label>
            {/* The input has been replaced with a select element as requested */}
            <select
              id="job-type"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
    bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
            >
              <option value="">{t("jobtypeplaceholder")}</option>
              <option value="on_site">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Requirements */}
          <div>
            <label
              htmlFor="requirements"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("requirements")}
            </label>
            <textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder={t("requirementsplaceholder")}
              rows={6}
              className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
            />
          </div>

          {/* Salary (optional) */}
          <div>
            <label
              htmlFor="salary"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("salary")}
            </label>
            <input
              id="salary"
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder={t("salaryplaceholder")}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
            />
          </div>

          {/* Application Deadline */}
          <div>
            <label
              htmlFor="deadline"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("deadline")}
            </label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isLoading || !title || !description || !jobType || !deadline
            }
            className="w-full py-3 bg-blue-600 text-white font-medium text-lg rounded-lg shadow-md 
            hover:bg-blue-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
          >
            {isLoading ? t("posting") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPostInput;

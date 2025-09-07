"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { usePostJobMutation, useGetMyJobsQuery } from "@/services/jobsAPI";
import { z } from "zod";

const JobPostInput: React.FC = () => {
  const t = useTranslations("jobpost");

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitJob, { isLoading }] = usePostJobMutation();
  const { refetch } = useGetMyJobsQuery();

  const jobSchema = z.object({
    title: z.string().max(50, { message: t("titlemax") }).min(5, { message: t("titlemin")}),
    description: z
      .string()
      .refine((val) => val.trim().split(/\s+/).length > 20, {
        message: t("descriptionmin"),
      })
      .refine((val) => val.trim().split(/\s+/).length < 700, {
        message: t("descriptionmax"),
      }),
    requirements: z
      .string()
      .refine((val) => val.trim().split(/\s+/).length > 20, {
        message: t("requirementsmin"),
      })
      .refine((val) => val.trim().split(/\s+/).length < 400, {
        message: t("requirementsmax"),
      }),
    salary: z
      .string()
      .optional()
      .refine((val) => !val || val.trim().split(/\s+/).length < 20, {
        message: t("salarymax"),
      }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = jobSchema.safeParse({ title, description, requirements, salary });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (!title || !description || !jobType || !category || !deadline) {
      setErrors((prev) => ({ ...prev, form: t("missingfields") }));
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("job_type", jobType);
    formData.append("category", category);
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
      setCategory("");
      setRequirements("");
      setSalary("");
      setDeadline("");
      setErrors({});
    } catch (err) {
      toast(t("error"));
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
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
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
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Job Type */}
          <div>
            <label
              htmlFor="job-type"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("jobtype")}
            </label>
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

          {/* Job Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("category")}
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
            >
              <option value="">{t("categoryplaceholder")}</option>
              <option value="Sales">Sales</option>
              <option value="Technology">Technology</option>
              <option value="Engineering">Engineering</option>
              <option value="Health">Health</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Marketing">Marketing</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Legal">Legal</option>
              <option value="Design">Design</option>
              <option value="others">Others</option>
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
            {errors.requirements && (
              <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
            )}
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
            {errors.salary && (
              <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
            )}
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
              isLoading ||
              !title ||
              !description ||
              !jobType ||
              !category ||
              !deadline
            }
            className="w-full py-3 bg-blue-600 text-white font-medium text-lg rounded-lg shadow-md 
            hover:bg-blue-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
          >
            {isLoading ? t("posting") : t("submit")}
          </button>

          {errors.form && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.form}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default JobPostInput;

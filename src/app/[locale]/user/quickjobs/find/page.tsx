"use client";
import { useFetchQuickJobsQuery } from "@/services/quickJobsAPI";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";

const QuickJobsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useFetchQuickJobsQuery(page);

  const user = useSelector((state: RootState) => state.auth.user);
  const currentUserId = user?.id;

  if (isLoading)
    return <p className="text-gray-800 dark:text-gray-200">Loading...</p>;
  if (error)
    return <p className="text-red-600 dark:text-red-400">Error loading jobs</p>;

  return (
    <div className="p-6 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Quick Job Posts
      </h2>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((job: any) => {
          const isMyJob = job.poster.user_id === currentUserId;

          return (
            <div
              key={job.quick_job_id}
              className="p-5 border rounded-2xl shadow hover:shadow-lg transition 
                         bg-white dark:bg-gray-800 
                         border-gray-200 dark:border-gray-700 
                         flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {job.poster.full_name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  📞 {job.poster.phone_number}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {job.details}
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  💰 {job.fixed_price} ETB
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📍 {job.location}
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    job.status === "open"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  Status: {job.status}
                </p>
              </div>

              <button
                disabled={isMyJob}
                className={`mt-4 w-full py-2 rounded-lg font-semibold transition-colors ${
                  isMyJob
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isMyJob ? "My Job" : "Apply"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8 text-gray-800 dark:text-gray-200">
        <button
          disabled={!data?.pagination.hasPrevPage}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 
                     border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 
                     hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Prev
        </button>
        <span className="font-medium">
          Page {data?.pagination.page} of {data?.pagination.totalPages}
        </span>
        <button
          disabled={!data?.pagination.hasNextPage}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 
                     border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 
                     hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuickJobsPage;

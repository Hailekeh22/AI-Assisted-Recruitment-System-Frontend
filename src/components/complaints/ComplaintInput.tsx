"use client";
import { useGetMyCompliantsQuery, usePostComplaintMutation } from "@/services/compliantAPI";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "sonner";

const ComplaintInput: React.FC = () => {
  const t = useTranslations("complaint");
  const [content, setComplaint] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [submitCompliant] = usePostComplaintMutation();
  const { refetch } = useGetMyCompliantsQuery();

  const MAX_WORDS = 1000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    if (words.length <= MAX_WORDS) {
      setComplaint(text);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wordCount > 0 && wordCount <= MAX_WORDS) {
      const result = await submitCompliant({ content }).unwrap();
      if (result) {
        toast(result.message);
        refetch()
      } else if (result?.error) {
        toast("Error submitting complaint");
      }

      setComplaint("");
      setWordCount(0);
    }
  };

  return (
    <div className="  w-full justify-center transition-colors">
      <div className="w-full max-w-3xl bg-blue-500/10 dark:bg-[#141414] rounded-2xl shadow- p-8 transition-colors">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="complaint"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              {t("details")}
            </label>
            <textarea
              id="complaint"
              value={content}
              onChange={handleChange}
              placeholder={t("inputplaceholder")}
              rows={10}
              className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-400">
                {wordCount} / {MAX_WORDS} {t("wordcount")}
              </span>
              {wordCount > MAX_WORDS && (
                <span className="text-red-500">{t("limitexceeded")}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={wordCount === 0 || wordCount > MAX_WORDS}
            className="w-full py-3 bg-green-600 text-white font-medium text-lg rounded-lg shadow-md 
            hover:bg-green-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
          >
            {t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintInput;

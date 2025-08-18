"use client"
import React, { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";


interface Complaint {
  complaint_id: number;
  content: string;
  status: "open" | "resolved" | "dismissed";
  filed_at: string;
  handled_by?: string;
  handled_at?: string;
  resolution_note?: string;
}

const ComplaintsTable: React.FC = () => {
    const t = useTranslations("complaint")
  // const { data: complaints = [] } = useGetComplaintsQuery();

  const [selectedField, setSelectedField] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const complaints: Complaint[] = [
    // mock data for UI preview
    {
      complaint_id: 1,
      content: "This is a sample very long complaint that should be truncated in the table but fully visible in the dialog when clicked...",
      status: "open",
      filed_at: "2025-08-18T09:29:23.732Z",
    },
    {
      complaint_id: 2,
      content: "Second complaint here",
      status: "resolved",
      filed_at: "2025-08-18T09:29:23.732Z",
      resolution_note: "we had recieved your complaint thank you we will fix it very soon!",
    },
    {
      complaint_id: 3,
      content: "Third complaint here",
      status: "dismissed",
      filed_at: "2025-08-18T09:29:23.732Z",
      resolution_note: "we had recieved your complaint thank you we will fix it very soon!",
    },
  ];

  const truncate = (text: string, max = 40) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  const getStatusDisplay = (status: Complaint["status"]) => {
    switch (status) {
      case "resolved":
        return (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" /> {t("resolved")}
          </span>
        );
      case "dismissed":
        return (
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="w-4 h-4" /> {t("rejected")}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-yellow-600">
            <Clock className="w-4 h-4" /> {t("opened")}
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-blue-500/10 dark:bg-[#252525] rounded-2xl shadow-lg p-6 transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {t("mycomplaints")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-blue-600 dark:bg-gray-700">
              <th className="p-3 text-gray-200">{t("content")}</th>
              <th className="p-3 text-gray-200">{t("status")}</th>
              <th className="p-3 text-gray-200">{t("filedat")}</th>
              <th className="p-3 text-gray-200">{t("resolution")}</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-black dark:text-gray-400">
                  No complaints submitted yet.
                </td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr
                  key={c.complaint_id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  {/* Complaint Content */}
                  <td
                    className="p-3 text-black dark:text-gray-100 cursor-pointer hover:underline"
                    onClick={() =>
                      setSelectedField({ title: "Complaint Content", content: c.content })
                    }
                  >
                    {truncate(c.content)}
                  </td>

                  {/* Status */}
                  <td className="p-3">{getStatusDisplay(c.status)}</td>

                  {/* Filed At */}
                  <td className="p-3 text-black dark:text-gray-400">
                    {new Date(c.filed_at).toLocaleString()}
                  </td>

                  {/* Resolution Note */}
                  <td
                    className="p-3 text-black dark:text-gray-400 cursor-pointer hover:underline"
                    onClick={() =>
                      setSelectedField({
                        title: "Resolution Note",
                        content: c.resolution_note || "No response yet",
                      })
                    }
                  >
                    {c.resolution_note ? truncate(c.resolution_note) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Shadcn Dialog */}
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
    </div>
  );
};

export default ComplaintsTable;


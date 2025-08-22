"use client";
import React, { useState } from "react";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useGetMyCompliantsQuery, useDeleteComplaintMutation } from "@/services/compliantAPI";
import type { Complaint } from "@/services/compliantAPI";
import { toast } from "sonner";

const ComplaintsTable: React.FC = () => {
  const t = useTranslations("complaint");
  const { data: complaints = [], refetch } = useGetMyCompliantsQuery();
  const [deleteComplaint] = useDeleteComplaintMutation();

  const [selectedField, setSelectedField] = useState<{
    title: string;
    content: string;
  } | null>(null);

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await deleteComplaint(id).unwrap();
      toast.success("Complaint deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to delete complaint");
    }
  };

  return (
    <div className="w-full bg-blue-500/10 dark:bg-[#141414] rounded-2xl shadow-lg p-6 transition-colors">
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
              <th className="p-3 text-gray-200">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-black dark:text-gray-400">
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

                  {/* Actions */}
                  <td className="p-3 text-red-600 cursor-pointer">
                    <Trash2
                      className="w-5 h-5 hover:text-red-800"
                      onClick={() => handleDelete(c.complaint_id)}
                    />
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

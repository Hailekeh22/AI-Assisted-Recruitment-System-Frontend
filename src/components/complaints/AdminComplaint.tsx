"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  useGetAdminComplaintsQuery,
  useRespondToComplaintMutation,
  useAdminDeleteComplainMutation,
} from "@/services/compliantAPI";
import type { Complaint } from "@/services/compliantAPI";

const AdminComplaintsTable: React.FC = () => {
  const t = useTranslations("complaint");
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetAdminComplaintsQuery(page);
  const [respondToComplaint] = useRespondToComplaintMutation();
  const [deleteComplaint] = useAdminDeleteComplainMutation();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseNote, setResponseNote] = useState("");
  const [responseStatus, setResponseStatus] = useState<"resolved" | "dismissed">("resolved");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const truncate = (text: string, max = 25) =>
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

  const handleSubmitResponse = async () => {
    if (!selectedComplaint) return;
    try {
      await respondToComplaint({
        complaintId: selectedComplaint.complaint_id,
        resolutionNote: responseNote,
        status: responseStatus,
      }).unwrap();
      toast.success("Complaint response submitted successfully");
      setSelectedComplaint(null);
      refetch();
      setResponseNote("");
      setResponseStatus("resolved");
    } catch {
      toast.error("Failed to submit response");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteComplaint(id).unwrap();
      toast.success("Complaint deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete complaint");
    }
  };

  const totalPages = data?.pagination.totalPages || 1;
  const currentPage = data?.pagination.page || 1;

  return (
    <div className="w-full rounded-2xl shadow-lg p-6 transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {t("allComplaints")}
      </h2>

      <div className="overflow-x-auto border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-blue-600 ">
              <th className="p-3 text-gray-200">{t("content")}</th>
              <th className="p-3 text-gray-200">{t("status")}</th>
              <th className="p-3 text-gray-200">{t("filedat")}</th>
              <th className="p-3 text-gray-200">{t("resolution")}</th>
              <th className="p-3 text-gray-200">{t("handledBy")}</th>
              <th className="p-3 text-gray-200">{t("handledAt")}</th>
              <th className="p-3 text-gray-200">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No complaints found.
                </td>
              </tr>
            ) : (
              data?.data.map((c) => (
                <tr
                  key={c.complaint_id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td
                    className="p-3 text-black dark:text-gray-100 cursor-pointer hover:underline"
                    onClick={() => setSelectedComplaint(c)}
                  >
                    {truncate(c.content)}
                  </td>
                  <td className="p-3">{getStatusDisplay(c.status)}</td>
                  <td className="p-3 text-black dark:text-gray-400">
                    {new Date(c.filed_at).toLocaleString()}
                  </td>
                  <td
                    className="p-3 text-black dark:text-gray-400 cursor-pointer hover:underline"
                    onClick={() => setSelectedComplaint(c)}
                  >
                    {c.resolution_note ? truncate(c.resolution_note) : "—"}
                  </td>
                  <td className="p-3 text-black dark:text-gray-400">{c.handled_by || "—"}</td>
                  <td className="p-3 text-black dark:text-gray-400 text-sm">
                    {c.handled_at ? new Date(c.handled_at).toLocaleString() : "—"}
                  </td>
                  <td className="p-3 text-red-600">
                    <Trash2
                      className="w-5 h-5 hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedDeleteId(c.complaint_id);
                        setDeleteDialogOpen(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination with current/total page */}
      {data?.pagination && (
        <div className="flex justify-between items-center gap-4 mt-4">
          <Button
            disabled={!data.pagination.hasPrevPage}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-3 py-1 rounded ${
              !data.pagination.hasPrevPage
                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            }`}
          >
            {t("previousbtn")}
          </Button>

          <span className="text-gray-800 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            disabled={!data.pagination.hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-3 py-1 rounded ${
              !data.pagination.hasNextPage
                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            }`}
          >
            {t("nextbtn")}
          </Button>
        </div>
      )}

      {/* Dialog for Viewing Full Complaint and Response */}
      <Dialog
        open={!!selectedComplaint}
        onOpenChange={() => {
          setSelectedComplaint(null);
          setResponseNote("");
          setResponseStatus("resolved");
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("complaintdetails")}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {selectedComplaint?.content}
          </div>

          {selectedComplaint?.status === "open" && (
            <div className="space-y-4 mt-4">
              <div>
                <label
                  htmlFor="status-select"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Set Status
                </label>
                <select
                  id="status-select"
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                  value={responseStatus}
                  onChange={(e) =>
                    setResponseStatus(e.target.value as "resolved" | "dismissed")
                  }
                >
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <textarea
                className="w-full h-24 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                placeholder={t("complaintrespondplaceholder")}
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
              />
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedComplaint(null)}
                >
                  {t("cancelbtn")}
                </Button>
                <Button variant="destructive" onClick={handleSubmitResponse}>
                  {t("respondtocompliantbtn")}
                </Button>
              </DialogFooter>
            </div>
          )}

          {selectedComplaint?.status !== "open" && (
            <DialogFooter className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedComplaint(null)}
              >
                {t("closebtn")}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("deletecomplianthead")}</DialogTitle>
          </DialogHeader>
          <div className="my-4 text-gray-700 dark:text-gray-200">
            {t("verifydelete")}
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("cancelbtn")}
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (selectedDeleteId) {
                  await handleDelete(selectedDeleteId);
                  setDeleteDialogOpen(false);
                }
              }}
            >
              {t("deletebtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminComplaintsTable;

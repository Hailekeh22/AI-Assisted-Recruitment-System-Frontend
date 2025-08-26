"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/services/usersAPI";
import { toast } from "sonner";

// Pagination type
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// User type
export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  profile_picture: string | null;
  isVerified: boolean;
}

export interface GetAllUsersResponse {
  data: User[];
  pagination: Pagination;
}

const UsersTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const { data: responseData, isLoading, isError, refetch } =
    useGetAllUsersQuery(page);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = responseData?.data || [];
  const pagination = responseData?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.page || 1;

  // Format date
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Extract initials
  const getInitials = (first: string, last: string) =>
    `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

  // Delete handler
  const handleDelete = async () => {
    if (!deletingUserId) return;
    try {
      await deleteUser(deletingUserId).unwrap();
      toast.success("User deleted successfully");
      setDeletingUserId(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="w-full bg-blue-500/10 dark:bg-[#252525] rounded-2xl shadow-lg p-6 transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        All Users
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-blue-600 dark:bg-gray-700 text-gray-200">
              <th className="p-3">Profile</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-black dark:text-gray-400"
                >
                  Loading users...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-red-500 dark:text-red-400"
                >
                  Failed to load users.
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-black dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.user_id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="p-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user.profile_picture || ""}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                      <AvatarFallback>
                        {getInitials(user.first_name, user.last_name)}
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="p-3 text-black dark:text-gray-100">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="p-3 text-black dark:text-gray-100">
                    {user.email}
                  </td>
                  <td className="p-3 text-black dark:text-gray-100">
                    {user.role}
                  </td>
                  <td className="p-3 text-black dark:text-gray-100">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="p-3">
                    {user.isVerified ? (
                      <CheckCircle2 className="text-blue-500 w-5 h-5" />
                    ) : (
                      <XCircle className="text-red-500 w-5 h-5" />
                    )}
                  </td>
                  <td className="p-3 text-red-600 cursor-pointer">
                    <Trash2
                      className="w-5 h-5 hover:text-red-800"
                      onClick={() => setDeletingUserId(user.user_id)}
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
          >
            Prev
          </Button>

          <span className="text-gray-800 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeletingUserId(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;

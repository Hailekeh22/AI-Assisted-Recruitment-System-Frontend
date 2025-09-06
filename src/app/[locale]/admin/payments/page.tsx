"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetAllPaymentsQuery } from "@/services/paymentAPI";

export default function page() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAllPaymentsQuery({ page, limit: 10 });

  if (isLoading) return <p>Loading payments...</p>;
  if (isError) return <p>Failed to load payments.</p>;

  const payments = data?.data || [];

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Currency</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Reference</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p: any, idx: number) => (
              <tr key={p.payment_id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="p-3">{(page - 1) * 10 + idx + 1}</td>
                <td className="p-3">
                  {p.users?.first_name || "N/A"} <br />
                  <span className="text-xs text-gray-500">{p.customer_email}</span>
                </td>
                <td className="p-3 font-semibold">{p.amount}</td>
                <td className="p-3">{p.currency}</td>
                <td className="p-3">{p.payment_method}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "success"
                        ? "bg-green-100 text-green-700"
                        : p.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(p.paid_at).toLocaleDateString()}
                </td>
                <td className="p-3">{p.trx_ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!data.pagination.hasPrevPage}
          >
            Previous
          </Button>
          <span className="self-center">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data.pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

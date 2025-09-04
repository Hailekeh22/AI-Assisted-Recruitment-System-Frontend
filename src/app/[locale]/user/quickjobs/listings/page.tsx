"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useFetchMyQuickJobsQuery } from "@/services/quickJobsAPI";
import { useTranslations } from "next-intl";

export default function QuickJobsPage() {
  const t = useTranslations("myquickpostedjobs");
  const { data, isLoading, isError } = useFetchMyQuickJobsQuery(0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {t("failedtofetch")}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {data && data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((job: any) => (
            <Card key={job.quick_job_id} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{job.details}</h2>
                    <p className="text-sm text-gray-600">
                      {t("location")} {job.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("price")} {job.fixed_price}
                    </p>
                    <p
                      className={`text-sm font-medium mt-2 ${
                        job.status === "open"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {t("status")} {job.status}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t("postedat")} {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {t("applications")} {job.quickjobassignments?.length || 0}
                    </p>
                    <Link href={`/user/quickjobs/listings/${job.quick_job_id}`}>
                      <Button size="sm" className="mt-2">
                       {t("viewapplications")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">{t("nojobsfound")}</p>
      )}
    </div>
  );
}

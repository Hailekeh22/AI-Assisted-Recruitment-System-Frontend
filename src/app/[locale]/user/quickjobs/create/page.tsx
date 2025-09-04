"use client";

import { useEffect, useState } from "react";
import { useEnsurePosterQuery, useCreateQuickJobMutation } from "@/services/quickJobsAPI";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("quickJobPosterPage");
  const { data: posterData, isLoading } = useEnsurePosterQuery(undefined);
  const [createQuickJob, { isLoading: posting }] = useCreateQuickJobMutation();

  const [details, setDetails] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (posterData?.ensured) {
      console.log("Quick Job Poster ensured:", posterData);
    }
  }, [posterData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !fixedPrice || !location) {
      toast.error(t("messages.allFieldsRequired"));
      return;
    }

    const data = await createQuickJob({
      details,
      fixed_price: parseFloat(fixedPrice),
      location, 
    }).unwrap();
    toast.success(data.message || t("messages.jobPostedSuccess"));

    setDetails("");
    setFixedPrice("");
    setLocation("");
  };

  if (isLoading) return <p>{t("messages.loading")}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">{t("pageTitle")}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">{t("form.details.label")}</label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t("form.details.placeholder")}
                className="resize-none min-h-[100px] overflow-y-auto"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">{t("form.fixedPrice.label")}</label>
              <Input
                type="number"
                step="0.01"
                value={fixedPrice}
                onChange={(e) => setFixedPrice(e.target.value)}
                placeholder={t("form.fixedPrice.placeholder")}
              />
            </div>
            <div>
              <label className="block font-medium mb-2">{t("form.location.label")}</label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("form.location.placeholder")}
              />
            </div>
            <Button type="submit" className="w-full" disabled={posting}>
              {posting ? t("buttons.posting") : t("buttons.postJob")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
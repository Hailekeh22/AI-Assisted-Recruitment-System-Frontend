"use client";

import { useEffect, useState } from "react";
import { useEnsurePosterQuery, useCreateQuickJobMutation } from "@/services/quickJobsAPI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function Page() {
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
      toast.error("All fields are required!");
      return;
    }

    const data = await createQuickJob({
      details,
      fixed_price: parseFloat(fixedPrice),
      location, 
    }).unwrap();
    toast.success(data.message || "Job posted successfully!");

    setDetails("");
    setFixedPrice("");
    setLocation("");
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Job Poster</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Details</label>
              <Input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Job details..."
              />
            </div>
            <div>
              <label className="block font-medium">Fixed Price</label>
              <Input
                type="number"
                step="0.01"
                value={fixedPrice}
                onChange={(e) => setFixedPrice(e.target.value)}
                placeholder="Enter price..."
              />
            </div>
            <div>
              <label className="block font-medium">Location</label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where is this job?"
              />
            </div>
            <Button type="submit" className="w-full" disabled={posting}>
              {posting ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

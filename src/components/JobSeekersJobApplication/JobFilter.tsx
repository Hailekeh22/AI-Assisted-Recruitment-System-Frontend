"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "on_site" | "remote" | "hybrid";
  category:
    | "Sales"
    | "Technology"
    | "Engineering"
    | "Health"
    | "Marketing"
    | "Education"
    | "Finance"
    | "Hospitality"
    | "Legal"
    | "Design"
    | "Agriculture"
    | "others";
}

interface JobFilterProps {
  jobs: Job[];
  onFilter: (filteredJobs: Job[]) => void;
}

const jobCategories = [
  "Sales",
  "Technology",
  "Engineering",
  "Health",
  "Marketing",
  "Education",
  "Finance",
  "Hospitality",
  "Legal",
  "Design",
  "Agriculture",
  "others",
];

const jobTypes = ["on_site", "remote", "hybrid"];

export default function JobFilter({ jobs, onFilter }: JobFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    let filtered = [...jobs];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((job) => selectedCategories.includes(job.category));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((job) => selectedTypes.includes(job.type));
    }

    onFilter(filtered);
  }, [selectedCategories, selectedTypes, jobs, onFilter]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
  };

  return (
    <div className=" py-5 px-7 sticky top-20 left-0">
      {/* Category Filters */}
      <div>
        <h3 className="font-semibold mb-2">Categories</h3>
        <div className="flex flex-col gap-2">
          {jobCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type Filters */}
      <div>
        <h3 className="font-semibold mb-2">Job Types</h3>
        <div className="flex flex-col gap-2">
          {jobTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 capitalize">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
              />
              <span>{type.replace("_", " ")}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Button */}
      <div className="self-end">
        <Button variant="secondary" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}

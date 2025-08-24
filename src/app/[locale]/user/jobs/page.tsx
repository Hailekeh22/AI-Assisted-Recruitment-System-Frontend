"use client";
import JobFilter from "@/components/JobSeekersJobApplication/JobFilter";
import JobsListing from "@/components/JobSeekersJobApplication/JobListing";
import React from "react";

const page = () => {
  
  return (
    <div className="flex w-full">
      {/* <JobFilter
        jobs={sampleJobs}
        onFilter={(filteredJobs) => {
          console.log(filteredJobs);
          
        }}
      /> */}
      <JobsListing />
    </div>
  );
};

export default page;

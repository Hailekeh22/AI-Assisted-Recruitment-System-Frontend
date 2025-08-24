import ComplaintInput from "@/components/complaints/ComplaintInput";
import ComplaintsTable from "@/components/complaints/ComplaintsTable";
import React from "react";

const page = () => {
  return (
    <>
      <div className=" py-10 flex sm:flex-col lg:flex-row gap-2">
        <ComplaintInput />
        <ComplaintsTable />
      </div>
    </>
  );
};

export default page;

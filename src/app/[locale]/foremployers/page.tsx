import EmployerRegistrationForm from "@/components/EmployerProfileComponents/EmployerRegistrationForm";
import Nav from "@/components/Nav/Nav";
import React from "react";

const page = () => {
  return (
    <>
      <Nav />
      <div>For Employers page</div>
      <EmployerRegistrationForm />
    </>
  );
};

export default page;

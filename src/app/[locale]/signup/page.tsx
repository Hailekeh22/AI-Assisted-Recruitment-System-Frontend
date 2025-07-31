"use client";

//Sample Signup page To check api and rtk
import { useRegisterJobSeekerMutation } from "@/services/userRegisterAPI";
import { useState } from "react";


const SignupPage = () => {
  const [registerJobSeeker, { isLoading, error }] = useRegisterJobSeekerMutation();
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitdata = async () => {
    try {
      const response = await registerJobSeeker({
        name,
        email,
        password,
      }).unwrap();
      console.log("Registration successful:", response);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center">
      <input
        type="text"
        placeholder="Name"
        className="border-2 border-gray-300 rounded p-2 mb-4"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border-2 border-gray-300 rounded p-2 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border-2 border-gray-300 rounded p-2 mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={() => {
          submitdata()
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default SignupPage;

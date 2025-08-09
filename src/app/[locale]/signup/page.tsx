"use client";

import Nav from "@/components/Nav/Nav";
import { useRegisterJobSeekerMutation } from "@/services/userRegisterAPI";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  profileImage: File | null;
}

const SignupPage = () => {
  const [registerJobSeeker, { isLoading, error }] =
    useRegisterJobSeekerMutation();

  const [formState, setFormState] = useState<FormState>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const submitdata = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("firstname", formState.firstname);
      formData.append("lastname", formState.lastname);
      formData.append("email", formState.email);
      formData.append("password", formState.password);

      if (formState.profileImage) {
          formData.append("profile_picture", formState.profileImage);
      }

      console.log(formData);
      await registerJobSeeker(formData).unwrap();

      console.log("Registration successful");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center">
        <form
          onSubmit={submitdata}
          className="flex flex-col w-full max-w-sm"
          encType="multipart/form-data"
        >
          <input
            type="text"
            placeholder="First Name"
            name="firstname"
            value={formState.firstname}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded p-2 mb-4"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastname"
            value={formState.lastname}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded p-2 mb-4"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded p-2 mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded p-2 mb-4"
            required
          />
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="mb-4"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Registering..." : "Submit"}
          </button>

          {error && (
            <p className="text-red-500 mt-2">
              Error: {(error as any)?.data?.message || "Something went wrong"}
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default SignupPage;

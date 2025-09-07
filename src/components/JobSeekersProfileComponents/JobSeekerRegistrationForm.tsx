"use client";
import { useRegisterJobSeekerMutation } from "@/services/userRegisterAPI";
import { setEmail } from "@/store/slices/emailSlice";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

export default function JobseekerRegistrationForm() {
  const t = useTranslations("jobseekerForm");
  const dispatch = useDispatch();
  const router = useRouter();
  const [registerJobseeker, { isLoading }] = useRegisterJobSeekerMutation();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  // Zod schema
  const schema = z
    .object({
      firstname: z.string().min(3, { message: t("firstNameRequired") }),
      lastname: z.string().min(3, { message: t("lastNameRequired") }),
      email: z.string().email({ message: t("invalidEmail") }),
      password: z.string().min(6, { message: t("passwordMin") }),
      confirmPassword: z.string().min(6, { message: t("confirmPasswordRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      key !== "confirmPassword" && formData.append(key, value as string)
    );
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    const res: any = await registerJobseeker(formData);

    if (res?.data) {
      toast.success(res.data?.message || t("registrationSuccess"));
      dispatch(setEmail(form.email));
      router.push(`/verifyemail`);
    } else if (res?.error) {
      const errorMsg = res.error?.data?.message || t("registrationError");
      toast.error(errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t("jobseekerRegistration")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstname"
          placeholder={t("firstName")}
          value={form.firstname}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}

        <input
          type="text"
          name="lastname"
          placeholder={t("lastName")}
          value={form.lastname}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}

        <input
          type="email"
          name="email"
          placeholder={t("email")}
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder={t("password")}
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder={t("confirmPassword")}
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}

        <label htmlFor="profileImg">{t("profilePicture")}</label>
        <input
          type="file"
          name="profileImg"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded hover:bg-blue-700 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer"
        >
          {isLoading ? t("registering") : t("register")}
        </button>
      </form>
    </div>
  );
}

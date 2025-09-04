"use client";
import { useRegisterEmployerMutation } from "@/services/userRegisterAPI";
import { setEmail } from "@/store/slices/emailSlice";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function EmployerRegistrationForm() {
  const t = useTranslations("employerForm");
  const dispatch = useDispatch();
  const router = useRouter();
  const [registerEmployer, { isLoading }] = useRegisterEmployerMutation();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    company_name: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);

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

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value as string)
    );
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    const res: any = await registerEmployer(formData);

    if (res?.data) {
      toast.success(res.data?.message || t("registrationSuccess"));
      dispatch(setEmail(form.email));
      router.push(`/verifyemail`);
    } else if (res?.error) {
      const errorMsg =
        res.error?.data?.message || t("registrationError");
      toast.error(errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t("employerRegistration")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstname"
          placeholder={t("firstName")}
          value={form.firstname}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder={t("lastName")}
          value={form.lastname}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("email")}
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t("password")}
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="company_name"
          placeholder={t("companyName")}
          value={form.company_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <label htmlFor="profileImg"> {t("profilePicture")}</label>
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          {isLoading ? t("registering") : t("register")}
        </button>
      </form>
    </div>
  );
}

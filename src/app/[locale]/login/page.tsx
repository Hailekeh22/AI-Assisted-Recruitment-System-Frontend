"use client";
import Nav from "@/components/Nav/Nav";
import { useLoginUserMutation } from "@/services/authAPI";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

interface LoginResponse {
  user?: {
    role?: "admin" | "employer" | "jobseeker";
  };
}

export default function LoginForm() {
  const t = useTranslations("loginPage");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const result: LoginResponse = await loginUser({ email, password }).unwrap();

      // Redirect based on user role
      const role = result.user?.role;
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "employer") {
        router.push("/employer");
      } else if (role === "jobseeker") {
        router.push("/user");
      } else {
        router.push("/");
      }
    } catch (error) {
      const err = error as FetchBaseQueryError | SerializedError;

      if ("data" in err && err.data && typeof err.data === "object" && "message" in err.data) {
        setErrorMsg((err.data as { message?: string }).message || "Login failed");
      } else {
        setErrorMsg("Login failed");
      }
    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center min-h-[70vh] justify-center lg:min-h-screen px-4">
        <div className="w-full max-w-md bg-white dark:bg-[#141414] rounded-xl shadow-md dark:shadow-white/20 p-4 lg:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">{t("title")}</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-50 mb-1">{t("email")}</label>
              <input
                type="email"
                placeholder={t("emailplaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-50 mb-1">{t("password")}</label>
              <input
                type="password"
                placeholder={t("passwordplaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 outline-none"
              />
            </div>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-60"
            >
              {isLoading ? t("btntextloading") : t("btntext")}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            {t("crateaccount")}{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              {t("foremployers")}
            </Link>
            {"   "}
            <Link href="/register" className="text-blue-600 hover:underline">
              {t("forjobseekers")}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

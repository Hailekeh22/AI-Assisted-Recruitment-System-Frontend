"use client";
import { Button } from "@/components/ui/button";
import { useLoginUserMutation } from "@/services/loginAPI";
import { useTranslations } from "next-intl";
import { useState } from "react";


const LoginPage = () => {
  const [userLogin, { isLoading, error }] = useLoginUserMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = useTranslations("Login");

  const submitCredentials = async () => {
    try {
      const res = await userLogin({
        email,
        password,
      }).unwrap()
      console.log("Login successful:", res);
    } catch (e) {
      console.log("login failed", e);
    }
  };
  return (
    <>
      <div>{t("title")}</div>

      <div>
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
      <Button
        onClick={() => {
          submitCredentials()
        }}
      >
        Submit
      </Button>
      </div>
    </>
  );
};

export default LoginPage;

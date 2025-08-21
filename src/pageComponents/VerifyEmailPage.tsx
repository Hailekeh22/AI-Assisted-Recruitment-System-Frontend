"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useVerifyEmailMutation } from "@/services/userRegisterAPI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearEmail } from "@/store/slices/emailSlice";

export default function VerifyEmailPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const storedEmail = useSelector((state: RootState) => state.email.value);
  const [email, setEmail] = useState(storedEmail ?? "");
  const [otp, setOtp] = useState("");
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || otp.length !== 6) {
      toast.error("Please enter a valid email and 6-digit OTP.");
      return;
    }

    try {
      const res = await verifyEmail({ email, otp }).unwrap();
      toast.success(res.message || "Email verified successfully!");

      dispatch(clearEmail());
      setEmail("");
      setOtp("");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.data?.message || "Verification failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl dark:bg-[#141414] p-8 shadow-md border">
        <h2 className="mb-4 text-2xl font-bold text-center">
          Verify Your Email
        </h2>
        <p className="mb-6 text-center text-gray-600">
          Please enter the 6-digit OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* OTP Input (Shadcn) */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-800"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </div>
    </div>
  );
}

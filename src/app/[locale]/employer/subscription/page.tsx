"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useInitializeEmployerPaymentMutation } from "@/services/paymentAPI";
import { toast } from "sonner";

const pricingPlans = [
  { title: "Basic", description: "Post 6 job, six Months Subscription", amount: 7000, features: ["6 Job Posting", "6 Months Duration", "Basic Support"] },
  { title: "Standard", description: "Post 10 jobs, One year Subscription", amount: 9000, features: ["10 Job Postings", "1 Year Duration", "Priority Support"] },
  { title: "Pro", description: "Post 15 jobs, One Year Subscription", amount: 13000, features: ["15 Job Postings", "1 Year Duration", "Priority Support"] },
  { title: "Enterprise", description: "Post 20 jobs, One Year Subscription", amount: 16000, features: ["20 job Postings", "1 Year Duration", "Dedicated Support"] },
  { title: "Premium Enterprise", description: "Post 30 jobs, 18 Months Subscription", amount: 20000, features: ["30 job Postings", "18 Months Subscription", "Dedicated Manager"] },
  { title: "Premium Plus", description: "Post 50 jobs, 18 Months Subscription", amount: 30000, features: ["50 job Postings", "18 Months Subscription", "Dedicated Account Manager"] },
];

export default function PricingCards() {
  const [selectedPlan, setSelectedPlan] = useState<{ title: string; amount: number } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [initializePayment, { isLoading }] = useInitializeEmployerPaymentMutation();

  const handlePayment = async () => {
    if (!selectedPlan || !phoneNumber) return;
    try {
      const response = await initializePayment({
        amount: selectedPlan.amount,
        phoneNumber,
      }).unwrap();
      console.log("Payment initialized:", response);
      if (response?.data?.checkout_url) {
          window.open(response.data.checkout_url, '_blank');
      } else {
        toast.error("Something went wrong. Try again.");
      }
      setSelectedPlan(null);
      setPhoneNumber("");
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
      {pricingPlans.map((plan, index) => (
        <Card key={index} className="shadow-xl rounded-2xl p-4">
          <CardHeader>
            <h2 className="text-xl font-bold">{plan.title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{plan.description}</p>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <p className="text-2xl font-semibold mt-4">{plan.amount} ብር</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => setSelectedPlan({ title: plan.title, amount: plan.amount })}
              className="w-full bg-green-600 hover:bg-green-800"
            >
              Buy Now
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Payment Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <p>
                <span className="font-semibold">Plan:</span> {selectedPlan.title}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> {selectedPlan.amount} ብር
              </p>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={handlePayment}
              disabled={isLoading || !phoneNumber}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

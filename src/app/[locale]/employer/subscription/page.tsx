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
  { title: "Basic", description: "Post 1 job, 7-day visibility", amount: 200, features: ["1 Job Posting", "7 Days Duration", "Basic Support"] },
  { title: "Standard", description: "Post 3 jobs, 14-day visibility", amount: 500, features: ["3 Job Postings", "14 Days Duration", "Priority Support"] },
  { title: "Pro", description: "Post 10 jobs, 30-day visibility", amount: 1500, features: ["10 Job Postings", "30 Days Duration", "Priority Support"] },
  { title: "Enterprise", description: "Unlimited postings for 1 month", amount: 3000, features: ["Unlimited Postings", "1 Month Duration", "Dedicated Support"] },
  { title: "Premium Enterprise", description: "Unlimited postings for 3 months", amount: 8000, features: ["Unlimited Postings", "3 Months Duration", "Dedicated Manager"] },
  { title: "Annual", description: "Unlimited postings for 1 year", amount: 20000, features: ["Unlimited Postings", "1 Year Duration", "Dedicated Account Manager"] },
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

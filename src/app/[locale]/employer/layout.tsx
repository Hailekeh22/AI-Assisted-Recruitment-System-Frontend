"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { hydrateUser } from "@/store/slices/authSlice";

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateUser());
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.auth.user);
  const t = useTranslations("employerDashboard");

  const employerNavItems = [
    {
      href: "/employer",
      label: t("dashboard"),
      iconName: "ChartNoAxesCombined" as const,
    },
    {
      href: "/employer/myjobs",
      label: t("myjobs"),
      iconName: "FileText" as const,
    },
    {
      href: "/employer/postjob",
      label: t("postjob"),
      iconName: "BriefcaseBusiness" as const,
    },
    {
      href: "/employer/inbox",
      label: t("messages"),
      iconName: "Inbox" as const,
    },
    {
      href: "/employer/complaint",
      label: t("submitcompliant"),
      iconName: "Send" as const,
    },
    {
      href: "/employer/interviews",
      label: t("interviews"),
      iconName: "Headset" as const,
    },
    {
      href: "/employer/subscription",
      label: t("subscriptionplan"),
      iconName: "ShieldPlus" as const,
    },
    {
      href: "/employer/profile",
      label: t("myprofile"),
      iconName: "CircleUser" as const,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout
      user={user}
      navItems={employerNavItems}
      basePath="/employer"
    >
      {children}
    </DashboardLayout>
  );
}

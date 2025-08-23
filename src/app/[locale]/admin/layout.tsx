"use client"
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { hydrateUser } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { useTranslations } from "next-intl";



export default  function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateUser());
  }, [dispatch]);
  const user = useSelector((state: RootState) => state.auth.user);
  const t =  useTranslations("adminDashboard")

  const adminNavItems = [
  { href: "/admin", label: t("overview"), iconName: "BarChart" as const },
  { href: "/admin/users", label: t("manageusers") , iconName: "Users" as const },
  { href: "/admin/managejobs", label: t("managejobs"), iconName: "Briefcase" as const },
  { href: "/admin/complients", label: t("complaints"), iconName: "Send" as const },
  { href: "/admin/payments", label: t("payments"), iconName: "DollarSign" as const },
  { href: "/admin/profile", label: t("myprofile"), iconName: "CircleUser" as const }
];

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user} navItems={adminNavItems} basePath="/admin">
      {children}
    </DashboardLayout>
  );
}
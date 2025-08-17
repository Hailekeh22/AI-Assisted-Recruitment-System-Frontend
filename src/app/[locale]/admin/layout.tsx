import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { getTranslations } from "next-intl/server";


async function getUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    
    return {
      name: (payload.name as string) || "Admin",
      email: payload.email as string,
      imageUrl: (payload.imageUrl as string) || "/default-avatar.png",
    };
  } catch (e) {
    console.error("Admin token verification failed:", e);
    return null;
  }
}


export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const t = await getTranslations("adminDashboard")

  const adminNavItems = [
  { href: "/admin", label: t("overview"), iconName: "BarChart" as const },
  { href: "/admin/users", label: t("manageusers") , iconName: "Users" as const },
  { href: "/admin/settings", label: t("settings"), iconName: "Settings" as const },
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
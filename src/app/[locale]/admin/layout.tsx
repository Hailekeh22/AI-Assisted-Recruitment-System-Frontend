import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import DashboardLayout from "@/components/layouts/DashboardLayout";

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

const adminNavItems = [
  { href: "/admin", label: "Overview", iconName: "BarChart" as const },
  { href: "/admin/users", label: "Manage Users", iconName: "Users" as const },
  { href: "/admin/settings", label: "Settings", iconName: "Settings" as const },
  { href: "/admin/managejobs", label: "Manage Job Postings", iconName: "Briefcase" as const },
  { href: "/admin/complients", label: "Complients", iconName: "Send" as const },
  { href: "/admin/payments", label: "Payments", iconName: "DollarSign" as const },
  { href: "/admin/profile", label: "My Profile", iconName: "CircleUser" as const }
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user} navItems={adminNavItems} basePath="/admin">
      {children}
    </DashboardLayout>
  );
}
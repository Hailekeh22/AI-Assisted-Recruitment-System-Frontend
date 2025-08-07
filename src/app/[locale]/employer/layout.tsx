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
      name: (payload.name as string) || "Employer",
      email: payload.email as string,
      imageUrl: (payload.imageUrl as string) || "/default-avatar.png",
    };
  } catch (e) {
    console.error("Employer token verification failed:", e);
    return null;
  }
}

const employerNavItems = [
  { href: "/employer", label: "Dashboard", iconName: "ChartNoAxesCombined" as const },
  { href: "/employer/myjobs", label: "My Job", iconName: "FileText" as const },
  { href: "/employer/postjob", label: "Post New Job", iconName: "BriefcaseBusiness" as const },
  { href: "/employer/applications", label: "Job Applications", iconName: "FileUser" as const },
  { href: "/employer/notifications", label: "Notifications", iconName: "Bell" as const },
  { href: "/employer/messages", label: "Messages", iconName: "MessageSquareMore" as const },
];

export default async function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user} navItems={employerNavItems} basePath="/employer">
      {children}
    </DashboardLayout>
  );
}
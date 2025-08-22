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
      name: (payload.name as string) || "Employer",
      email: payload.email as string,
      imageUrl: (payload.imageUrl as string) || "/default-avatar.png",
    };
  } catch (e) {
    console.error("Employer token verification failed:", e);
    return null;
  }
}



export default async function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const t = await getTranslations("employerDashboard");

  const employerNavItems = [
  { href: "/employer", label: t("dashboard"), iconName: "ChartNoAxesCombined" as const },
  { href: "/employer/myjobs", label: t("myjobs"), iconName: "FileText" as const },
  { href: "/employer/postjob", label: t("postjob"), iconName: "BriefcaseBusiness" as const },
  { href: "/employer/messages", label: t("messages"), iconName: "MessageSquareMore" as const },
  { href: "/employer/complaint", label: t("submitcompliant"), iconName: "Send" as const },
  { href: "/employer/interviews", label: t("interviews"), iconName: "Headset" as const },
  { href: "/employer/subscription", label: t("subscriptionplan"), iconName: "ShieldPlus" as const },
  { href: "/employer/profile", label: t("myprofile"), iconName: "CircleUser" as const },
];

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user} navItems={employerNavItems} basePath="/employer">
      {children}
    </DashboardLayout>
  );
}
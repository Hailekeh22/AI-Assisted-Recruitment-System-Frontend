"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  AlertCircle, 
  CreditCard,
  Shield,
  Settings,
  BarChart3,
  Plus,
  ArrowRight
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const AdminWelcomePage = () => {
  const t = useTranslations("adminDashboardLanding");

  const features = [
    {
      icon: Users,
      title: t("features.manageUsers.title"),
      description: t("features.manageUsers.description")
    },
    {
      icon: Briefcase,
      title: t("features.manageJobs.title"),
      description: t("features.manageJobs.description")
    },
    {
      icon: AlertCircle,
      title: t("features.manageComplaints.title"),
      description: t("features.manageComplaints.description")
    },
    {
      icon: CreditCard,
      title: t("features.managePayments.title"),
      description: t("features.managePayments.description")
    }
  ];

  const quickActions = [
    {
      title: t("actions.viewUsers"),
      icon: Users,
      href: "/admin/users"
    },
    {
      title: t("actions.viewJobs"),
      icon: Briefcase,
      href: "/admin/jobs"
    },
    {
      title: t("actions.viewComplaints"),
      icon: AlertCircle,
      href: "/admin/complaints"
    },
    {
      title: t("actions.viewPayments"),
      icon: CreditCard,
      href: "/admin/payments"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t("title")}</h1>
              <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("welcome.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("welcome.subtitle")}
            </p>
            
            {/* Quick Actions Row */}
            <div className="flex justify-center gap-4 mb-8">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link href={action.href}>
                      <IconComponent className="h-4 w-4 mr-2" />
                      {action.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminWelcomePage;
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Users, 
  Plus,
  ArrowRight,
  Target,
  Rocket,
  Shield
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const EmployerWelcomePage = () => {
  const t = useTranslations("employerDashboardLanding");

  const features = [
    {
      icon: Briefcase,
      title: t("features.postJobs.title"),
      description: t("features.postJobs.description")
    },
    {
      icon: Users,
      title: t("features.findTalent.title"),
      description: t("features.findTalent.description")
    },
    {
      icon: Target,
      title: t("features.smartMatching.title"),
      description: t("features.smartMatching.description")
    },
    {
      icon: Shield,
      title: t("features.secure.title"),
      description: t("features.secure.description")
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
              <Rocket className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("welcome.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("welcome.subtitle")}
            </p>
            
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/employer/postjob">
                  {t("actions.getStarted")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/employer/subscription">
                  {t("actions.package")}
                </Link>
              </Button>
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

export default EmployerWelcomePage;
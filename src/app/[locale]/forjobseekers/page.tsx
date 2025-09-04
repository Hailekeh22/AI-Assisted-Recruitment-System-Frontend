import JobseekerRegisterForm from "@/components/JobSeekersProfileComponents/JobSeekerRegistrationForm";
import Nav from "@/components/Nav/Nav";
import { useTranslations } from "next-intl";
import { Briefcase, Target, Rocket, Award } from "lucide-react";

const page = () => {
  const t = useTranslations("jobseekerForm");

  const features = [
    {
      icon: Briefcase,
      title: t("hero.features.opportunities.title"),
      description: t("hero.features.opportunities.description")
    },
    {
      icon: Target,
      title: t("hero.features.matching.title"),
      description: t("hero.features.matching.description")
    },
    {
      icon: Rocket,
      title: t("hero.features.fast.title"),
      description: t("hero.features.fast.description")
    },
    {
      icon: Award,
      title: t("hero.features.quality.title"),
      description: t("hero.features.quality.description")
    }
  ];

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 px-6 gap-8 items-center min-h-[80vh]">
            {/* Left Side - Registration Form */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="w-full max-w-md">
                <JobseekerRegisterForm />
              </div>
            </div>

            {/* Right Side - Hero Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {t("hero.title")}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                  {t("hero.subtitle")}
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
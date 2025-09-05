"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Briefcase, 
  Search, 
  UserCheck, 
  FileText, 
  Building, 
  Handshake, 
  Rocket,
  Target,
  Zap,
  Users,
  Star,
  Shield,
  Globe
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Footer from '@/components/footer/Footer';

const LandingPage: React.FC = () => {
  const t = useTranslations("LandingPage");

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };


    const features = [
    { icon: Zap, title: t("features.lightningFast.title"), description: t("features.lightningFast.description") },
    { icon: Target, title: t("features.precisionMatching.title"), description: t("features.precisionMatching.description") },
    { icon: Shield, title: t("features.securePrivate.title"), description: t("features.securePrivate.description") },
    { icon: Globe, title: t("features.globalReach.title"), description: t("features.globalReach.description") },
    { icon: Users, title: t("features.smartFilters.title"), description: t("features.smartFilters.description") },
    { icon: Star, title: t("features.topRated.title"), description: t("features.topRated.description") }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 z-0" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YTIgMiAwIDEgMSA0IDAgMiAyIDAgMCAxLTQgMHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
          </div>
          
          <div className="relative z-10 px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-6">
                {t("moto")}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12"
            >
              {t("description")}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "backOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-12 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group"
            >
              {t("ctabtnlandingpage")}
              <ArrowRight className="inline-block ml-3 group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t("featuresSection.title")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("featuresSection.subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t("howitworks")}
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t("info")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* For Job Seekers */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-3xl">
                  <h4 className="text-2xl font-semibold mb-8 text-blue-600 dark:text-blue-400">
                    {t("forjobseekers")}
                  </h4>
                  <div className="space-y-8">
                    {[
                      { icon: FileText, title: t("JSfirststep"), desc: t("JSfirststepdesc") },
                      { icon: UserCheck, title: t("JSsecondstep"), desc: t("JSsecondstepdesc") },
                      { icon: Handshake, title: t("JSthirdstep"), desc: t("JSthirdstepdesc") }
                    ].map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.2 }}
                          className="flex items-start text-left"
                        >
                          <div className="bg-blue-600 text-white p-3 rounded-lg mr-6 flex-shrink-0">
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <h5 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                              {step.title}
                            </h5>
                            <p className="text-gray-600 dark:text-gray-400">
                              {step.desc}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* For Employers */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-3xl">
                  <h4 className="text-2xl font-semibold mb-8 text-purple-600 dark:text-purple-400">
                    {t("foremployers")}
                  </h4>
                  <div className="space-y-8">
                    {[
                      { icon: Briefcase, title: t("Efirststep"), desc: t("Efirststepdesc") },
                      { icon: Search, title: t("Esecondstep"), desc: t("Esecondstepdesc") },
                      { icon: Building, title: t("Ethirdstep"), desc: t("Ethirdstepdesc") }
                    ].map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.2 }}
                          className="flex items-start text-left"
                        >
                          <div className="bg-purple-600 text-white p-3 rounded-lg mr-6 flex-shrink-0">
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <h5 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                              {step.title}
                            </h5>
                            <p className="text-gray-600 dark:text-gray-400">
                              {step.desc}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {[
                { number: "10K+", label: "Jobs Posted" },
                { number: "5K+", label: "Companies" },
                { number: "50K+", label: "Candidates" },
                { number: "98%", label: "Satisfaction Rate" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="p-6"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t("ctaheader")}
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
                {t("ctabody")}
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {t("ctabtnemp")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold py-4 px-8 rounded-full text-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                >
                  {t("ctabtnjs")}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
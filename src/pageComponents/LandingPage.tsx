"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Briefcase, Search, UserCheck, FileText, Building, Handshake, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';



const LandingPage: React.FC = () => {
  const t = useTranslations("LandingPage");
  const heroRef = useRef<HTMLDivElement>(null);

  // GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animations
      gsap.fromTo(".hero-headline", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(".hero-subheadline", 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 }
      );
      gsap.fromTo(".hero-cta-button", 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.8 }
      );      

    }, heroRef);

    return () => {
        ctx.revert(); // cleanup GSAP
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <main ref={heroRef}>
        {/* Hero Section */}
        <section className="relative h-[100dvh] flex items-center justify-center text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-white dark:bg-black z-0"></div>
          <div className=" p-3 relative z-10">
            <h2 className="hero-headline text-blue-800 dark:text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
              {t("moto")}
            </h2>
            <p className="hero-subheadline text-lg md:text-2xl max-w-3xl mx-auto text-blue-700 dark:text-blue-100 mb-8">
              {t("description")}
            </p>
            <button className=" bg-blue-900 text-white dark:bg-white dark:text-blue-600 font-bold py-3 px-8 rounded-full text-lg shadow-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300">
              Get Started Now <ArrowRight className="inline-block ml-2" size={20} />
            </button>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-gray-100 dark:bg-black/50">
          <div className="container mx-auto px-4 text-center">
            <h3 className="how-it-works-title text-3xl md:text-4xl font-bold mb-4">{t("howitworks")}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-16">{t("info")}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* For Job Seekers */}
              <div>
                <h4 className="text-2xl font-semibold mb-8 text-blue-600 dark:text-blue-400">{t("forjobseekers")}</h4>
                <div className="steps-container space-y-8 relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-dashed border-gray-300 dark:border-gray-700 hidden md:block" style={{top: '2rem', height: 'calc(100% - 4rem)'}}></div>
                  
                  <div className="step-card flex items-center md:flex-col text-left md:text-center md:relative">
                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 p-4 rounded-full mr-6 md:mr-0 md:mb-4 z-10"><FileText size={32}/></div>
                    <div>
                      <h5 className="font-bold text-xl">{t("JSfirststep")}</h5>
                      <p className="text-gray-600 dark:text-gray-400">{t("JSfirststepdesc")}</p>
                    </div>
                  </div>
                  <div className="step-card flex items-center md:flex-col text-left md:text-center md:relative">
                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 p-4 rounded-full mr-6 md:mr-0 md:mb-4 z-10"><UserCheck size={32}/></div>
                    <div>
                      <h5 className="font-bold text-xl">{t("JSsecondstep")}</h5>
                      <p className="text-gray-600 dark:text-gray-400">{t("JSsecondstepdesc")}</p>
                    </div>
                  </div>
                   <div className="step-card flex items-center md:flex-col text-left md:text-center md:relative">
                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 p-4 rounded-full mr-6 md:mr-0 md:mb-4 z-10"><Handshake size={32}/></div>
                    <div>
                      <h5 className="font-bold text-xl">{t("JSthirdstep")}</h5>
                      <p className="text-gray-600 dark:text-gray-400">{t("JSthirdstepdesc")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Employers */}
              <div>
                <h4 className="text-2xl font-semibold mb-8 text-indigo-600 dark:text-indigo-400">{t("foremployers")}</h4>
                <div className="steps-container space-y-8 relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-dashed border-gray-300 dark:border-gray-700 hidden md:block" style={{top: '2rem', height: 'calc(100% - 4rem)'}}></div>

                  <div className="step-card flex items-center md:flex-col text-left md:text-center md:relative">
                    <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-4 rounded-full mr-6 md:mr-0 md:mb-4 z-10"><Briefcase size={32}/></div>
                    <div>
                      <h5 className="font-bold text-xl">{t("Efirststep")}</h5>
                      <p className="text-gray-600 dark:text-gray-400">{t("Efirststepdesc")}</p>
                    </div>
                  </div>
                   <div className="step-card flex items-center md:flex-col text-left md:text-center md:relative">
                    <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-4 rounded-full mr-6 md:mr-0 md:mb-4 z-10"><Search size={32}/></div>
                    <div>
                      <h5 className="font-bold text-xl">{t("Esecondstep")}</h5>
                      <p className="text-gray-600 dark:text-gray-400">{t("Esecondstepdesc")}</p>
                    </div>
                  </div>
                  <div className="step-card flex items-center md:flex-col text-left md:text-center md:relative">
                    <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-4 rounded-full mr-6 md:mr-0 md:mb-4 z-10"><Building size={32}/></div>
                    <div>
                      <h5 className="font-bold text-xl">{t("Ethirdstep")}</h5>
                      <p className="text-gray-600 dark:text-gray-400">{t("Ethirdstepdesc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className=" dark:bg-gray-900 py-20 sm:py-24">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">{t("ctaheader")}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">{t("ctabody")}</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                {t("ctabtnemp")}
              </button>
              <button className="bg-transparent border-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                {t("ctabtnjs")}
              </button>
            </div>
            
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="footer" className="bg-gray-800 dark:bg-black/50 text-gray-300 dark:text-gray-400 py-16">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <h4 className="text-white text-xl font-bold mb-4">JOb Site</h4>
              <p className="text-gray-400 dark:text-gray-500 mb-4">AI-Powered Recruitment.</p>
              <div className="flex space-x-4">
                 <a href="#" className="text-gray-400 hover:text-white"><Mail size={20}/></a>
                 <a href="#" className="text-gray-400 hover:text-white"><Phone size={20}/></a>
                 <a href="#" className="text-gray-400 hover:text-white"><MapPin size={20}/></a>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Sitemap</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Companies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-4">For Employers</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Employer FAQ</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-4">Legal</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR/CCPA</a></li>
              </ul>
            </div>

             <div className="col-span-2 md:col-span-1">
                <h5 className="font-semibold text-white mb-4">Contact</h5>
                <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                    <li className="flex items-center"><Mail className="mr-2" size={16}/> contact@uog.edu.et</li>
                    <li className="flex items-center"><Phone className="mr-2" size={16}/> +1 (251) 912-345-678</li>
                    <li className="flex items-center"><MapPin className="mr-2" size={16}/> Gondar Ethiopia, Maraki</li>
                </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 dark:border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} JOb Site. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

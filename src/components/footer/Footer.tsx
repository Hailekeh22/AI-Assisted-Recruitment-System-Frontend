import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";

const Footer = () => {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, ease: "easeOut" },
  };

   const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-16">
        <div className="container mx-auto px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8"
          >
            <motion.div variants={fadeIn} className="col-span-2 lg:col-span-1">
              <h4 className="text-white text-xl font-bold mb-4">JobConnect</h4>
              <p className="text-gray-400 dark:text-gray-500 mb-6">
                AI-Powered Recruitment Platform
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Phone size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MapPin size={20} />
                </a>
              </div>
            </motion.div>

            {[
              {
                title: "Sitemap",
                links: ["Jobs", "Companies", "Resources", "About Us", "Blog"],
              },
              {
                title: "For Employers",
                links: ["Post a Job", "Pricing", "Employer FAQ"],
              },
              {
                title: "Legal",
                links: [
                  "Privacy Policy",
                  "Terms & Conditions",
                  "Cookie Policy",
                  "GDPR/CCPA",
                ],
              },
            ].map((section, index) => (
              <motion.div key={index} variants={fadeIn}>
                <h5 className="font-semibold text-white mb-4">
                  {section.title}
                </h5>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.div variants={fadeIn} className="col-span-2 md:col-span-1">
              <h5 className="font-semibold text-white mb-4">Contact</h5>
              <ul className="space-y-3 text-gray-400 dark:text-gray-500">
                <li className="flex items-center">
                  <Mail className="mr-3" size={16} /> contact@jobconnect.com
                </li>
                <li className="flex items-center">
                  <Phone className="mr-3" size={16} /> +1 (251) 912-345-678
                </li>
                <li className="flex items-center">
                  <MapPin className="mr-3" size={16} /> Gondar, Ethiopia
                </li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 border-t border-gray-700 dark:border-gray-800 pt-8 text-center text-gray-500"
          >
            <p>
              &copy; {new Date().getFullYear()} JobConnect. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

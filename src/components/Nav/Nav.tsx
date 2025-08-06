'use client';

import { useTranslations } from "next-intl";
import { ModeToggle } from "../ModeToggle";
import { BriefcaseBusiness } from 'lucide-react';
import { LanguageButton } from "../languageSwitcher/LanguageButton";
import Link from "next/link";

const Nav = () => {
  const t = useTranslations("Nav");

  const MiddleNavLinks = [
    { name: t('findJob'), href: "/forjobseekers" },
    { name: t('forEmployers'), href: "/foremployers" },
    { name: t('about'), href: "/about" }
  ];

  const RightNavLinks = [
    { name: t('signUp'), href: "/signup" },
    { name: t('logIn'), href: "/login" }
  ];

  return (
    <nav className="w-full flex justify-between items-center py-4 px-6 shadow">
      {/* Left Nav: Title */}
      <div className="flex items-center gap-2">
        <BriefcaseBusiness />
        <h2 className="text-xl font-bold">{t("title")}</h2>
      </div>

      {/* Middle Nav: Center nav links */}
      <div className="flex gap-6">
        {MiddleNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm hover:underline"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right Nav: Right nav links, Theme and Language Toggles */}
      <div className="flex items-center gap-4">
        {RightNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm hover:underline"
          >
            {link.name}
          </Link>
        ))}
        <ModeToggle />
        <LanguageButton />
      </div>
    </nav>
  );
};

export default Nav;

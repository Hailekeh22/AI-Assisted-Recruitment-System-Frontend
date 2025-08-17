"use client";

import { useTranslations } from "next-intl";
import { ModeToggle } from "../ModeToggle";
import { BriefcaseBusiness, Menu } from "lucide-react";
import { LanguageButton } from "../languageSwitcher/LanguageButton";
import { Link } from "@/i18n/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Nav = () => {
  const t = useTranslations("Nav");

  const MiddleNavLinks = [
    { name: t("findJob"), href: "/forjobseekers" },
    { name: t("forEmployers"), href: "/foremployers" },
    { name: t("about"), href: "/about" },
    { name: t("contactUs"), href: "/contactus" },
  ];

  const RightNavLinks = [{ name: t("logIn"), href: "/login" }];

  return (
    <nav className="w-full flex sticky top-0 justify-between bg-white dark:bg-black dark:shadow-white/10 items-center py-4 px-6 shadow z-50">
      {/* Left Nav: Logo */}
      <div>
        <Link className="flex items-center gap-2" href="/">
          <BriefcaseBusiness />
          <h2 className="text-xl font-bold">{t("title")}</h2>
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6">
        {MiddleNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-md hover:scale-105 duration-200"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right Nav - Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {RightNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-md hover:scale-105 duration-200"
          >
            {link.name}
          </Link>
        ))}
        <ModeToggle />
        <LanguageButton />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 sm:w-80">
            <SheetHeader className=" py-6">
              <SheetTitle>{t("title")}</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 mt-6 px-6">
              {MiddleNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium hover:underline"
                >
                  {link.name}
                </Link>
              ))}

              <hr />

              {RightNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium hover:underline"
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center gap-4 mt-4">
                <ModeToggle />
                <LanguageButton />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Nav;

"use client";

import { useTranslations } from "next-intl";
import { ModeToggle } from "../ModeToggle";
import { BriefcaseBusiness, Menu } from "lucide-react";
import { LanguageButton } from "../languageSwitcher/LanguageButton";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutUserMutation } from "@/services/authAPI";

const Nav = () => {
  const [logoutUser] = useLogoutUserMutation();
  const t = useTranslations("Nav");
  const user = useSelector((state: RootState) => state.auth.user);

  // Public nav
  const PublicNavLinks = [
    { name: t("findJob"), href: "/forjobseekers" },
    { name: t("forEmployers"), href: "/foremployers" },
    { name: t("about"), href: "/about" },
    { name: t("contactUs"), href: "/contactus" },
  ];

  // Jobseeker nav
  const JobSeekerNavLinks = [
    { name: t("complaints"), href: "/user/complaints" },
    { name: t("myApplications"), href: "/user/applications" },
    { name: t("messages"), href: "/user/messages" },
    { name: t("quickJobs"), href: "/user/quickjobs" },
  ];

  const handleLogout = () => {
    logoutUser({}).unwrap();
    window.location.href = "/";
  };

  const getInitials = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <nav className="w-full flex sticky top-0 justify-between bg-white dark:bg-black dark:shadow-white/10 items-center py-4 px-6 shadow z-50">
      {/* Left Nav: Logo */}
      <div>
        {user && user.role === "jobseeker" ? (
          <Link className="flex items-center gap-2" href="/user">
            <BriefcaseBusiness />
            <h2 className="text-xl font-bold">{t("title")}</h2>
          </Link>
        ) : (
          <Link className="flex items-center gap-2" href="/">
            <BriefcaseBusiness />
            <h2 className="text-xl font-bold">{t("title")}</h2>
          </Link>
        )}
      </div>

      {/* Middle Nav */}
      <div className="hidden md:flex gap-6">
        {user && user.role === "jobseeker"
          ? JobSeekerNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-md hover:scale-105 duration-200"
              >
                {link.name}
              </Link>
            ))
          : PublicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-md hover:scale-105 duration-200"
              >
                {link.name}
              </Link>
            ))}
      </div>

      {/* Right Nav */}
      <div className="hidden md:flex items-center gap-4">
        {user && user.role === "jobseeker" ? (
          <>
            <ModeToggle />
            <LanguageButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full shadow-md"
                >
                  <Avatar>
                    <AvatarImage src={user.photo} alt={user.firstname} />
                    <AvatarFallback>
                      {getInitials(user.firstname)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstname}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">
                    {t("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/setting" className="w-full">
                    {t("setting")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    {t("logout")}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-md hover:scale-105 duration-200"
            >
              {t("logIn")}
            </Link>
            <ModeToggle />
            <LanguageButton />
          </>
        )}
      </div>

      {/* Mobile Nav */}
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
              {user && user.role === "jobseeker"
                ? JobSeekerNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium hover:underline"
                    >
                      {link.name}
                    </Link>
                  ))
                : PublicNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium hover:underline"
                    >
                      {link.name}
                    </Link>
                  ))}

              <hr />

              <div className="flex items-center gap-4 mt-4">
                <ModeToggle />
                <LanguageButton />
                {user && user.role === "jobseeker" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full shadow-md"
                      >
                        <Avatar>
                          <AvatarImage src={user.photo} alt={user.firstname} />
                          <AvatarFallback>
                            {getInitials(user.firstname)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.firstname}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/profile" className="w-full">
                          {t("profile")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/setting" className="w-full">
                          {t("setting")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Button
                          onClick={handleLogout}
                          variant="destructive"
                          className="w-full"
                        >
                          {t("logout")}
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login">{t("logIn")}</Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Nav;

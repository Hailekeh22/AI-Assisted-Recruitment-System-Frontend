"use client";

import Link from "next/link";
import * as Icons from "lucide-react"; // Import all icons
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ModeToggle";
import { LanguageButton } from "@/components/languageSwitcher/LanguageButton";
import { Button } from "@/components/ui/button";
import { useLogoutUserMutation } from "@/services/authAPI";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

// a map of icon names to components
const iconMap: { [key: string]: React.ElementType } = {
  BriefcaseBusiness: Icons.BriefcaseBusiness,
  Menu: Icons.Menu,
  BarChart: Icons.BarChart,
  Users: Icons.Users,
  Settings: Icons.Settings,
  Briefcase: Icons.Briefcase,
  FileText: Icons.FileText,
  Bell: Icons.Bell,
  FileUser: Icons.FileUser,
  MessageSquareMore: Icons.MessageSquareMore,
  ChartNoAxesCombined: Icons.ChartNoAxesCombined,
  DollarSign: Icons.DollarSign,
  CircleUser: Icons.CircleUser,  
  Send: Icons.Send,
  Headset: Icons.Headset, 
  ShieldPlus: Icons.ShieldPlus, 
};

interface UserProfile {
  name: string;
  email: string;
  imageUrl: string;
}

interface NavItem {
  href: string;
  label: string;
  iconName: keyof typeof iconMap;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  children: React.ReactNode;
  user: UserProfile;
  basePath: string;
}

export default function DashboardLayout({
  navItems,
  children,
  user,
  basePath,
}: DashboardLayoutProps) {
  // Function to get initials from name for Avatar fallback
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const [logoutUser] = useLogoutUserMutation();

  const logout = async () => {
    try {
      await logoutUser("logout").unwrap();
      window.location.href = "/";
    } catch (error) {
      const err = error as FetchBaseQueryError | SerializedError;

      if ("data" in err && err.data && typeof err.data === "object" && "message" in err.data) {
        alert((err.data as { message?: string }).message || "Logout failed");
      } else {
        alert("Logout failed");
      }
    }
  };

  const IconMenu = iconMap["Menu"];
  const IconBriefcaseBusiness = iconMap["BriefcaseBusiness"];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar Navigation */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href={`${basePath}/`}
              className="flex items-center gap-2 font-semibold"
            >
              <IconBriefcaseBusiness className="h-6 w-6" />
              <span className="">Job Website</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="flex flex-col w-full px-2 text-base font-medium lg:px-4 space-y-2">
              {navItems.map((item) => {
                const Icon = iconMap[item.iconName];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center w-full gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Navigation Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <IconMenu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className=" py-3 px-2 flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={`${basePath}/`}
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <IconBriefcaseBusiness className="h-6 w-6" />
                      <span>Job Website</span>
                    </Link>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Main navigation menu.
                  </SheetDescription>
                </SheetHeader>
                <div className=" px-2 py-3">
                  {navItems.map((item) => {
                    const Icon = iconMap[item.iconName];
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* black div to push right-side content */}
          <div className="w-full flex-1"></div>

          {/* Right-side Header */}
          <div className="flex items-center gap-4">
            <LanguageButton />
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Avatar>
                    <AvatarImage src={user.imageUrl} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`${basePath}/profile`} className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`${basePath}/setting`} className="w-full">
                    Setting
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Button
                    onClick={logout}
                    variant="destructive"
                    className=" w-full"
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

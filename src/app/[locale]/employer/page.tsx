// app/[locale]/employer/page.tsx
'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Briefcase, FileText, Settings } from 'lucide-react';

const employerNavItems = [
  { href: '/employer', label: 'Dashboard', icon: Briefcase },
  { href: '/employer/jobs', label: 'My Jobs', icon: FileText },
  { href: '/employer/settings', label: 'Settings', icon: Settings },
];

const employerUser = {
  name: 'Employer User',
  email: 'employer@example.com',
  imageUrl: '/employer-avatar.png', // Replace with actual image or leave blank
};

export default function EmployerDashboardPage() {
  return (
    <DashboardLayout
      navItems={employerNavItems}
      pageTitle="Employer Dashboard"
      user={employerUser}
      basePath="/admin"
    >
      <div className="text-sm text-muted-foreground">
        Welcome to the employer dashboard!
      </div>
    </DashboardLayout>
  );
}

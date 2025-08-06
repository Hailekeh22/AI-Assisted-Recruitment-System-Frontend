'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Package, Users, Settings } from 'lucide-react';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: Package },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  imageUrl: '/admin-avatar.png', // Replace with actual image or leave blank
};

export default function AdminDashboardPage() {
  return (
    <DashboardLayout
      navItems={adminNavItems}
      pageTitle="Admin Dashboard"
      user={adminUser}
      basePath="/admin"
    >
      <div className="text-sm text-muted-foreground">
        Welcome to the admin dashboard!
      </div>
    </DashboardLayout>
  );
}

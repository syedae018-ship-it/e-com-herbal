'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on admin login page, render children directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-sand-50/60">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">{children}</main>
    </div>
  );
}

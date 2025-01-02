"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardCheck, Settings } from 'lucide-react';

// Types
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    label: 'Students',
    href: '/dashboard/students',
    icon: <Users className="w-5 h-5" />
  },
  {
    label: 'Attendance',
    href: '/dashboard/attendance',
    icon: <ClipboardCheck className="w-5 h-5" />
  },
  {
    label: 'Paramètres',
    href: '/dashboard/settings',
    icon: <Settings className="w-5 h-5" />
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm">
      {/* Logo Section */}
      <div className="flex flex-col items-center py-8 px-4">
        <div className="relative w-40 h-40 mb-4">
          <Image
            src="/ENSA-LOGO-4.jpg"
            alt="ENSA Tétouan"
            fill
            style={{ objectFit: 'contain' }}
            className="transition-all duration-300 hover:scale-105"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
          EduTrack ENSA
        </h1>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 pt-8">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-105'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">
          ENSA Tétouan
        </p>
      </div>
    </div>
  );
} 
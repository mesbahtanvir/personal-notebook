'use client';

import Link from 'next/link';
import { Home, LayoutDashboard, Settings, User } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-card text-card-foreground border-r">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Notebook</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center p-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground space-x-3"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="truncate">
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-muted-foreground truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

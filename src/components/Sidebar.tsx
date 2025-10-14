'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Home, LayoutDashboard, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {!isCollapsed && <h1 className="text-xl font-bold">Notebook</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-800"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          )}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center p-3 rounded-lg transition-colors',
              'hover:bg-gray-800',
              'text-gray-300 hover:text-white',
              isCollapsed ? 'justify-center' : 'space-x-3'
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'space-x-3')}>
          <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-gray-400 truncate">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

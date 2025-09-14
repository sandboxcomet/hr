'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  UserPlus,
  TrendingUp,
  BookOpen,
  Gift,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Package,
} from 'lucide-react';

// Navigation will be defined inside the component to use translations

interface ShellProps {
    children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const locale = useLocale();

  const navigation = [
    { name: t('dashboard'), href: `/${locale}`, icon: LayoutDashboard },
    { name: t('employees'), href: `/${locale}/employees`, icon: Users },
    { name: t('attendance'), href: `/${locale}/attendance`, icon: Clock },
    { name: t('leaves'), href: `/${locale}/leaves`, icon: Calendar },
    { name: t('payroll'), href: `/${locale}/payroll`, icon: DollarSign },
    { name: t('recruitment'), href: `/${locale}/recruitment`, icon: UserPlus },
    { name: t('performance'), href: `/${locale}/performance`, icon: TrendingUp },
    { name: t('training'), href: `/${locale}/training`, icon: BookOpen },
    { name: t('benefits'), href: `/${locale}/benefits`, icon: Gift },
    { name: t('assets'), href: `/${locale}/assets`, icon: Package },
    { name: t('selfService'), href: `/${locale}/self-service`, icon: User },
  ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="fixed inset-0 bg-black/50" />
                </div>
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between px-6 border-b">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">HR System</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-colors',
                                        isActive
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User profile */}
                    <div className="border-t p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto p-3 rounded-2xl"
                                >
                                    <Avatar className="w-8 h-8 mr-3">
                                        <AvatarImage src="/api/placeholder/32/32" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <div className="text-sm font-medium">John Doe</div>
                                        <div className="text-xs text-gray-500">HR Administrator</div>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuItem>
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top bar */}
                <header className="bg-white border-b h-16 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                        <LanguageSwitcher />
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}


"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Stethoscope, Home, Calendar, Users, Plus, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import PropTypes from 'prop-types';

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { href: '/admin/patients', label: 'Patients', icon: Users },
];

function Sidebar({ isOpen, onClose }) { // eslint-disable-line react/prop-types
    const pathname = usePathname();

    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200/60",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                            <Stethoscope className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">DocLink</span>
                            <span className="text-sm text-gray-500">Admin Panel</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-blue-50 relative">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">3</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-10 w-10 hover:bg-gray-100"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-6 py-8 space-y-3">
                    {adminNavItems.map(item => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'group flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 relative',
                                    isActive
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 border-r-4 border-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                                )}
                            >
                                <div className={cn(
                                    'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className={cn(
                                    'transition-all duration-200',
                                    isActive ? 'font-semibold' : 'group-hover:font-medium'
                                )}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="absolute right-4 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-gray-200/60 space-y-4">
                    {/* Account Info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">AD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Hello, Admin!</p>
                            <p className="text-xs text-gray-500 truncate">Super Admin</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start h-12 border-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200" asChild>
                        <Link href="/" className="flex items-center gap-3">
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Exit Admin</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function AdminLayout({
  children,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
           

            {/* Main Layout */}
            <div className="flex">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <button
                        className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') setSidebarOpen(false);
                        }}
                        aria-label="Close sidebar"
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 lg:ml-0">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

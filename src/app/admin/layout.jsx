
"use client"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bell, 
  Stethoscope, 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Shield,
  Activity,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/context/auth';

const adminNavItems = [
    { 
      href: '/admin', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Overview & Analytics',
      color: 'blue'
    },
    { 
      href: '/admin/appointments', 
      label: 'Appointments', 
      icon: Calendar,
      description: 'Manage Bookings',
      color: 'green',
      badge: null // Will be dynamic
    },
    { 
      href: '/admin/doctors', 
      label: 'Doctors', 
      icon: Stethoscope,
      description: 'Medical Staff',
      color: 'purple'
    },
    { 
      href: '/admin/patients', 
      label: 'Patients', 
      icon: Users,
      description: 'Patient Records',
      color: 'orange'
    },
    { 
      href: '/admin/settings', 
      label: 'Settings', 
      icon: Settings,
      description: 'System Configuration',
      color: 'gray'
    },
];

function Sidebar({ isOpen, onClose }) { // eslint-disable-line react/prop-types
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user, isAuthenticated } = useAuth();
    const [notifications] = useState(3);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Get color classes based on nav item color
    const getColorClasses = (color, isActive) => {
        const colors = {
          blue: isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
            : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
          green: isActive 
            ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
            : 'bg-green-50 text-green-600 group-hover:bg-green-100',
          purple: isActive 
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
            : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
          orange: isActive 
            ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
            : 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
          gray: isActive 
            ? 'bg-gray-600 text-white shadow-lg shadow-gray-200' 
            : 'bg-gray-50 text-gray-600 group-hover:bg-gray-100',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static border-r border-gray-200",
            isOpen ? "translate-x-0" : "-translate-x-full",
            isCollapsed ? "w-20" : "w-72"
        )}>
            <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className={cn(
                        "flex items-center gap-3 transition-all duration-300",
                        isCollapsed && "justify-center"
                    )}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
                            <Stethoscope className="h-6 w-6 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                                    DocLink
                                </span>
                                <span className="text-xs text-gray-600 font-medium">Admin Panel</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {!isCollapsed && (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-full hover:bg-blue-100 relative hidden lg:flex"
                            >
                                <Bell className="h-4 w-4 text-gray-600" />
                                {notifications > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                                        {notifications}
                                    </span>
                                )}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-9 w-9 hover:bg-gray-100 rounded-full"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {adminNavItems.map(item => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden',
                                    isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50'
                                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                                )}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 animate-pulse" />
                                )}
                                
                                <div className={cn(
                                    'relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-white/20 text-white'
                                        : getColorClasses(item.color, false)
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                
                                {!isCollapsed && (
                                    <div className="flex-1 min-w-0 relative">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={cn(
                                                'transition-all duration-200 truncate',
                                                isActive ? 'font-semibold' : 'font-medium'
                                            )}>
                                                {item.label}
                                            </span>
                                            {item.badge && (
                                                <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className={cn(
                                            "text-xs mt-0.5 truncate",
                                            isActive ? "text-blue-100" : "text-gray-500"
                                        )}>
                                            {item.description}
                                        </p>
                                    </div>
                                )}
                                
                                {isActive && !isCollapsed && (
                                    <ChevronRight className="h-4 w-4 text-white animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick Stats Section */}
                {!isCollapsed && (
                    <div className="px-4 py-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-green-600" />
                                    <span className="text-xs text-gray-600">Status</span>
                                </div>
                                <p className="text-sm font-bold text-green-600 mt-1">Active</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs text-gray-600">Role</span>
                                </div>
                                <p className="text-sm font-bold text-blue-600 mt-1">Admin</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200 bg-white space-y-3">
                    {/* Account Info */}
                    {!isCollapsed && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 hover:shadow-md transition-all">
                            <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">
                                    {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user?.name || 'Admin'}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Shield className="h-3 w-3 text-blue-600" />
                                    <p className="text-xs text-blue-600 font-medium">Super Admin</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {isCollapsed && (
                        <div className="flex justify-center">
                            <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">
                                    {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                    
                    <Button 
                        variant="outline" 
                        className={cn(
                            "w-full h-11 border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 group",
                            isCollapsed ? "justify-center px-0" : "justify-start"
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut className={cn(
                            "h-5 w-5 text-red-600 group-hover:scale-110 transition-transform",
                            !isCollapsed && "mr-3"
                        )} />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
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
    const pathname = usePathname();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Determine if we should show right sidebar (only on dashboard)
    const showRightSidebar = pathname === '/admin';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="h-10 w-10 hover:bg-blue-50"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                                <Stethoscope className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-gray-900">DocLink Admin</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                            3
                        </span>
                    </Button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex lg:pt-0 pt-16">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') setSidebarOpen(false);
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label="Close sidebar"
                    />
                )}

                {/* Main Content */}
                <main className={`flex-1 min-h-screen ${showRightSidebar ? 'xl:mr-80' : ''}`}>
                    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
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

'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Calendar,
  Users,
  User,
  Settings,
  Stethoscope,
  FileText,
  Shield,
  LogOut,
  X,
  ChevronRight,
  Activity,
  Bell,
  Moon,
  Sun,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/context/auth';

export function DoctorSidebar({ doctor, isOpen, onClose }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logout } = useAuth();
  const doctorId = searchParams.get('id');
  const [notifications] = useState(5);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navItems = [
    {
      href: `/doctor?id=${doctorId}`,
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & Analytics',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      href: `/doctor/appointments?id=${doctorId}`,
      label: 'Appointments',
      icon: Calendar,
      description: 'Manage Bookings',
      gradient: 'from-green-500 to-emerald-500',
      badge: notifications > 0 ? notifications : null
    },
    {
      href: `/doctor/patients?id=${doctorId}`,
      label: 'Patients',
      icon: Users,
      description: 'Patient Records',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      href: `/doctor/profile?id=${doctorId}`,
      label: 'Profile',
      icon: User,
      description: 'My Profile',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      href: `/doctor/settings?id=${doctorId}`,
      label: 'Settings',
      icon: Settings,
      description: 'Preferences',
      gradient: 'from-gray-500 to-slate-600'
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getGradientColors = (gradientString) => {
    if (gradientString.includes('blue')) return 'rgb(59, 130, 246), rgb(6, 182, 212)';
    if (gradientString.includes('green')) return 'rgb(34, 197, 94), rgb(16, 185, 129)';
    if (gradientString.includes('purple')) return 'rgb(168, 85, 247), rgb(236, 72, 153)';
    if (gradientString.includes('orange')) return 'rgb(249, 115, 22), rgb(239, 68, 68)';
    return 'rgb(107, 114, 128), rgb(71, 85, 105)';
  };

  if (!doctorId) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] transform transition-all duration-300 ease-in-out lg:translate-x-0",
          "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
          "border-r border-white/10 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">DocLink</h1>
                  <p className="text-xs text-slate-400">Doctor Portal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Doctor Profile */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
              <Avatar className="h-11 w-11 ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
                <AvatarImage src={doctor?.avatar} alt={doctor?.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-sm">
                  {doctor?.name?.charAt(0)?.toUpperCase() || 'D'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Dr. {doctor?.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3 text-cyan-400" />
                  <p className="text-xs text-cyan-400 font-medium truncate">{doctor?.specialization}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA
              </Badge>
              <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30">
                Verified
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href.split('?')[0];
              const gradientStyle = isActive 
                ? { backgroundImage: `linear-gradient(135deg, ${getGradientColors(item.gradient)})` }
                : {};
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-medium transition-all duration-300',
                    'hover:translate-x-1',
                    isActive
                      ? 'bg-gradient-to-r text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  )}
                  style={gradientStyle}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}

                  {/* Icon container */}
                  <div
                    className={cn(
                      'flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-300',
                      isActive
                        ? 'bg-white/20 shadow-inner'
                        : 'bg-white/5 group-hover:bg-white/10'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        'truncate transition-all',
                        isActive ? 'font-semibold' : 'font-medium'
                      )}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs h-5 px-1.5 bg-white/20 text-white border-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs mt-0.5 truncate transition-all",
                      isActive ? "text-white/80" : "text-slate-500 group-hover:text-slate-400"
                    )}>
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow indicator for active */}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-white/80 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Stats Section */}
          <div className="px-4 py-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-xs text-slate-400">Status</span>
                </div>
                <p className="text-sm font-bold text-green-400">Online</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-slate-400">Alerts</span>
                </div>
                <p className="text-sm font-bold text-blue-400">{notifications}</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5 mb-2"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <Sun className="mr-3 h-4 w-4" />
              ) : (
                <Moon className="mr-3 h-4 w-4" />
              )}
              <span className="text-sm">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </Button>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className="w-full justify-start bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 group"
            >
              <LogOut className="mr-3 h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `
      }} />
    </>
  );
}

DoctorSidebar.propTypes = {
  doctor: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
    specialization: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
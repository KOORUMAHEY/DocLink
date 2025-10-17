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
  Briefcase,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/context/theme';

export function DoctorSidebar({ doctor, isOpen, onClose }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const doctorId = searchParams.get('id');
  const [notifications] = useState(5);

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
      href: `/doctor/appointments/form?id=${doctorId}`,
      label: 'Form Designer',
      icon: FileText,
      description: 'Custom Forms',
      gradient: 'from-teal-500 to-cyan-500'
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
          isDark 
            ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10" 
            : "bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200",
          "shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "p-6 border-b",
            isDark ? "border-white/10" : "border-gray-200"
          )}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div className={cn(
                    "absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 animate-pulse",
                    isDark ? "border-slate-900" : "border-white"
                  )} />
                </div>
                <div>
                  <h1 className={cn(
                    "text-lg font-bold",
                    isDark ? "text-white" : "text-gray-900"
                  )}>DocLink</h1>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-slate-400" : "text-gray-500"
                  )}>Doctor Portal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "lg:hidden h-8 w-8",
                  isDark 
                    ? "text-slate-400 hover:text-white hover:bg-white/10" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Doctor Profile */}
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm border transition-all cursor-pointer group",
              isDark 
                ? "bg-gradient-to-r from-white/5 to-white/10 border-white/10 hover:border-white/20" 
                : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:border-gray-300"
            )}>
              <Avatar className={cn(
                "h-11 w-11 ring-2 transition-all",
                isDark 
                  ? "ring-white/20 group-hover:ring-white/40" 
                  : "ring-gray-300 group-hover:ring-gray-400"
              )}>
                <AvatarImage src={doctor?.avatar} alt={doctor?.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-sm">
                  {doctor?.name?.charAt(0)?.toUpperCase() || 'D'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-semibold truncate",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Dr. {doctor?.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3 text-cyan-400" />
                  <p className="text-xs text-cyan-400 font-medium truncate">{doctor?.specialization}</p>
                </div>
              </div>
              <ChevronRight className={cn(
                "h-4 w-4 transition-colors",
                isDark 
                  ? "text-slate-500 group-hover:text-white" 
                  : "text-gray-400 group-hover:text-gray-600"
              )} />
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

          {/* Navigation - Table Format */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Table Header */}
            <div className={cn(
              "sticky top-0 px-4 py-3 border-b",
              isDark 
                ? "bg-slate-800/50 border-white/10 backdrop-blur-sm" 
                : "bg-gray-100/50 border-gray-200 backdrop-blur-sm"
            )}>
              <div className="flex items-center justify-between">
                <p className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  isDark ? "text-slate-400" : "text-gray-600"
                )}>
                  Navigation
                </p>
                <p className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  isDark ? "text-slate-400" : "text-gray-600"
                )}>
                  {navItems.filter(item => pathname === item.href.split('?')[0]).length > 0 ? 'Active' : ''}
                </p>
              </div>
            </div>

            {/* Navigation Items - Table Rows */}
            <div className={cn(
              "divide-y",
              isDark ? "divide-white/5" : "divide-gray-200"
            )}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href.split('?')[0];
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'group relative block px-4 py-4 transition-all duration-200',
                      isActive
                        ? isDark
                          ? 'bg-white/5 border-l-4 border-l-cyan-500'
                          : 'bg-gray-50 border-l-4 border-l-cyan-500'
                        : isDark
                          ? 'hover:bg-white/[0.02]'
                          : 'hover:bg-gray-50/50'
                    )}
                  >
                    {/* Gradient Accent Bar */}
                    <div 
                      className={cn(
                        "absolute inset-y-0 left-0 w-1 rounded-r-full transition-all duration-300 opacity-0 group-hover:opacity-100",
                        isActive ? "opacity-100" : ""
                      )}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${getGradientColors(item.gradient)})`
                      }}
                    />

                    <div className="flex items-center gap-3 ml-2">
                      {/* Icon */}
                      <div className={cn(
                        'flex items-center justify-center h-10 w-10 rounded-lg flex-shrink-0 transition-all duration-300',
                        isActive
                          ? 'bg-gradient-to-br shadow-lg'
                          : isDark
                            ? 'bg-slate-700/50 group-hover:bg-slate-600/50'
                            : 'bg-gray-200/50 group-hover:bg-gray-300/50'
                      )}
                      style={isActive ? {
                        backgroundImage: `linear-gradient(135deg, ${getGradientColors(item.gradient)})`
                      } : {}}
                      >
                        <Icon className={cn(
                          'h-5 w-5 transition-colors',
                          isActive 
                            ? 'text-white' 
                            : isDark
                              ? 'text-slate-300 group-hover:text-white'
                              : 'text-gray-600 group-hover:text-gray-900'
                        )} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className={cn(
                            'text-sm font-semibold transition-colors truncate',
                            isActive 
                              ? isDark
                                ? 'text-white'
                                : 'text-gray-900'
                              : isDark
                                ? 'text-slate-200 group-hover:text-white'
                                : 'text-gray-700 group-hover:text-gray-900'
                          )}>
                            {item.label}
                          </p>
                          {item.badge && (
                            <span className={cn(
                              'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0',
                              'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          'text-xs transition-colors truncate',
                          isActive 
                            ? isDark
                              ? 'text-slate-300'
                              : 'text-gray-600'
                            : isDark
                              ? 'text-slate-500 group-hover:text-slate-400'
                              : 'text-gray-500 group-hover:text-gray-600'
                        )}>
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className={cn(
                        'h-4 w-4 transition-all duration-300 flex-shrink-0',
                        isActive
                          ? isDark
                            ? 'text-cyan-400'
                            : 'text-cyan-600'
                          : isDark
                            ? 'text-slate-500 group-hover:text-slate-300'
                            : 'text-gray-400 group-hover:text-gray-600',
                        'group-hover:translate-x-1'
                      )} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer Section */}
          <div className={cn(
            "px-4 py-4 border-t",
            isDark ? "border-white/10" : "border-gray-200"
          )}>
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start mb-2",
                isDark 
                  ? "text-slate-300 hover:text-white hover:bg-white/5" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
              onClick={toggleTheme}
            >
              {isDark ? (
                <Sun className="mr-3 h-4 w-4" />
              ) : (
                <Moon className="mr-3 h-4 w-4" />
              )}
              <span className="text-sm">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </Button>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className={cn(
                "w-full justify-start border transition-all duration-200 group",
                isDark 
                  ? "bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/40" 
                  : "bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              )}
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
            background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
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
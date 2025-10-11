'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function DoctorSidebar({ doctor }) { // eslint-disable-line react/prop-types
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  const navItems = [
    {
      href: `/doctor?id=${doctorId}`,
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & stats'
    },
    {
      href: `/doctor/appointments?id=${doctorId}`,
      label: 'Appointments',
      icon: Calendar,
      description: 'Manage bookings'
    },
    {
      href: `/doctor/patients?id=${doctorId}`,
      label: 'Patients',
      icon: Users,
      description: 'Patient records'
    },
    {
      href: `/doctor/appointments/form?id=${doctorId}`,
      label: 'Schedule',
      icon: FileText,
      description: 'New appointments'
    },
  ];

  const profileItems = [
    {
      href: `/doctor/profile?id=${doctorId}`,
      label: 'Profile',
      icon: User,
      description: 'Manage profile'
    },
    {
      href: `/doctor/settings?id=${doctorId}`,
      label: 'Settings',
      icon: Settings,
      description: 'Preferences'
    },
  ];

  if (!doctorId) return null;

  return (
    <nav className="flex h-full w-64 flex-col bg-white border-r border-gray-200 shadow-sm" aria-label="Main navigation">
      {/* Logo & Brand */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-200">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
          <Stethoscope className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            DocLink
          </h1>
          <p className="text-xs text-muted-foreground">Doctor Portal</p>
        </div>
      </div>

      {/* Doctor Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={doctor?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              {doctor?.name?.charAt(0)?.toUpperCase() || 'D'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Dr. {doctor?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {doctor?.specialization}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            HIPAA
          </Badge>
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
            Verified
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href.split('?')[0];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                )} />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Account
          </p>
          {profileItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href.split('?')[0];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                )} />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => {
            // Handle logout
            window.location.href = '/login';
          }}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
}